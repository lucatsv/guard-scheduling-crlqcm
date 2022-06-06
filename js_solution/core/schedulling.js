const UNAVAILABLE_GUARDS_ERROR_MESSAGE = "Sorry! We could not find available guards"

const findEligibleGuards = (guards, contract) => {
    if (contract.requireArmedGuard) {
        return guards.filter(g => g.fireArmLicense)
    }
    return guards
}

const getPTOPerGuard = (listOfPTOs) => {
    const ptoPerGuard = {}
    listOfPTOs.forEach(element => {
        if(!ptoPerGuard[element.guardId]) {
            ptoPerGuard[element.guardId] = []
        }
        ptoPerGuard[element.guardId].push((new Date(element.date)).toLocaleDateString("en-US", {timeZone : "UTC"}))
    });

    return ptoPerGuard
}

const getContractWorkDays = (contract, from, to) => {
    const contractDaysOfWeek = contract.daysOfWeek.map(dow => dayOfWeekToInteger(dow)).sort()
    const workingDays = []

    for (const d = from; from <= to; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()
        if(contractDaysOfWeek.some(cd => cd === dayOfWeek)) {
            workingDays.push(new Date(d))
       }
    }

    return workingDays
}

const getContractsWorkDays = (contracts, from, to) => {
    const contractsWorkDays = []
    for(const contract of contracts) {
        const contractWorkDays = getContractWorkDays(contract, new Date(from), new Date(to))
        contractsWorkDays.push({ contractId : contract._id, workDays : contractWorkDays })
    }
    return contractsWorkDays
}

const dayOfWeekToInteger = (dayOfWeek) => {
    const normalizedDayOfWeek = dayOfWeek.toUpperCase()
    if(normalizedDayOfWeek === "SUNDAY") {
        return 0
    }  
    else if(normalizedDayOfWeek === "MONDAY") {
        return 1
    }
    else if(normalizedDayOfWeek === "TUESDAY") {
        return 2
    }
    else if(normalizedDayOfWeek === "WEDNESDAY") {
        return 3
    }
    else if(normalizedDayOfWeek === "THURSDAY") {
        return 4
    }
    else if(normalizedDayOfWeek === "FRIDAY") {
        return 5
    }
    else if(normalizedDayOfWeek === "SATURDAY") {
        return 6
    }
    
}

const findAvailableGuardsOnDay = (eligibleGuards, guardsPTO, dayOfWork) => {

    const availableGuardsOnDay = []

    for(const guard of eligibleGuards) {
        const guardPTOs = guardsPTO[guard._id]

        if(!guardPTOs?.some(d => toUTCString(d) === toUTCString(dayOfWork))){
            availableGuardsOnDay.push(guard)
        }
        
    }
    return availableGuardsOnDay
}

const getScheduleOptions = (contract, guards, ptos, from, to) => {

    const eligibleGuards = findEligibleGuards(guards, contract)

    const guardsPTO = getPTOPerGuard(ptos)

    const workingDays = getContractWorkDays(contract, from, to)

    const scheduleOption = {}
    for(const workDay of workingDays) {
        const availableGuards = findAvailableGuardsOnDay(eligibleGuards, guardsPTO, workDay)
        addElementsToObjectArrayProperty(scheduleOption, workDay.toString(), availableGuards)
    }

    return scheduleOption;
}

const getScheduleOptionsPerContract = (contracts, guards, ptos, from, to) => {

    const scheduleOptionPerContract = []

    for(const contract of contracts) {
        const contractScheduleOption = getScheduleOptions(contract, guards, ptos, new Date(from), new Date(to))
        scheduleOptionPerContract.push({ contractId : contract._id, option : contractScheduleOption })
    }

    return scheduleOptionPerContract
}

const findEligibleGuardsPerContract = (contracts, guards) => {

    const eligibleGuardsPerContract = []

    for(const contract of contracts) {
        const contractEligibleGuards = guards.filter(g => g.fireArmLicense === contract.requireArmedGuard)
        eligibleGuardsPerContract.push({ contractId : contract._id , guards : contractEligibleGuards }) 
    }

    return eligibleGuardsPerContract
}

const leastAvailableGuardFromPossibleGuards = (guardsShiftAvailability, listOfPossibleGuards) => {
    
    let leastAvailable = { score : Number.MAX_VALUE}
    for(const pg of listOfPossibleGuards) {
        if( leastAvailable.score > guardsShiftAvailability[pg._id]) {
            leastAvailable = { guardId : pg._id, score : guardsShiftAvailability[pg._id]}
        }
    }

    return leastAvailable
}

const createSchedule = (scheduleOption) => {

    const schedule = []
    const guardsShiftAvailability = {}
    
    const flatScheduleGuardOptions = [].concat.apply([], Object.keys(scheduleOption).map(date=> scheduleOption[date]))
    for(const guard of flatScheduleGuardOptions.map(g => g._id)) {
        guardsShiftAvailability[guard] = (guardsShiftAvailability[guard] ? ++guardsShiftAvailability[guard] : 1)
    }

    Object.keys(scheduleOption).forEach(date => {
        const guardsAvailableOnTheDay = scheduleOption[date]

        const leastAvailable = leastAvailableGuardFromPossibleGuards(guardsShiftAvailability, guardsAvailableOnTheDay)

        const normalizedDate = toUTCString(date).split(', ')[0]

        const scheduledGuard = flatScheduleGuardOptions.find(g => g._id === leastAvailable.guardId)?.name

        if(scheduledGuard) {
            schedule.push( { date : normalizedDate, guard : scheduledGuard } )
        } else {
            schedule.push( { date : normalizedDate, message : UNAVAILABLE_GUARDS_ERROR_MESSAGE } )

        }
    })

    return schedule
}

const createScheduleForAllContracts = (contract, scheduleOptionPerContract) => {
    
    const schedule = []
    
    for(const contractOption of scheduleOptionPerContract) {

        Object.keys(contractOption.option).forEach(day => {

            const guard = contractOption.option[day][0]

            schedule.push({ day, contract : contract.find(c => c._id === contractOption.contractId).name, guard : guard ? guard.name : UNAVAILABLE_GUARDS_ERROR_MESSAGE })

            assignGuardToShift(scheduleOptionPerContract, day.toString(), guard)
        })
    }

    return schedule
}

const assignGuardToShift = (scheduleOptionPerContract, day, guard) => {
    for(const contractSchedule of scheduleOptionPerContract) {

        Object.keys(contractSchedule.option).forEach(scheduleDay => {
            if(scheduleDay === day)
                contractSchedule.option[scheduleDay] = contractSchedule.option[scheduleDay].filter(g => g._id !== guard?._id)
         
        })
    }
}

const addElementsToObjectArrayProperty = (object, propertyName, elements) => {
    if(!object[propertyName]) {
        object[propertyName] = []
    }
    object[propertyName].push(...elements)
}

const toUTCString = (date) => {
    return (new Date(date)).toLocaleString('en-US', {timeZone : 'UTC'})
}

module.exports = { findEligibleGuards, findAvailableGuardsOnDay, getPTOPerGuard, getContractWorkDays, getScheduleOptions, getScheduleOptionsPerContract, createSchedule, createScheduleForAllContracts, findEligibleGuardsPerContract, getContractsWorkDays, UNAVAILABLE_GUARDS_ERROR_MESSAGE }
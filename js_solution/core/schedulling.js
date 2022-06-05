const e = require("express")

const findEligibleGuards = (guards, contract) => {
    const requireArmedGuard = contract.requireArmedGuard

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
        ptoPerGuard[element.guardId].push(element.date)
    });

    return ptoPerGuard
}

const getContractWorkingDays = (contract, from, to) => {
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
        if(!guardPTOs?.some(d => d.getTime() === dayOfWork.getTime())) {
            availableGuardsOnDay.push(guard)
        }
        
    }
    return availableGuardsOnDay
}

const getScheduleOptions = (contract, guards, ptos, from, to) => {

    const eligibleGuards = findEligibleGuards(guards, contract)

    const guardsPTO = getPTOPerGuard(ptos)

    const workingDays = getContractWorkingDays(contract, from, to)

    const scheduleOption = {}
    for(const workDay of workingDays) {
        const availableGuards = findAvailableGuardsOnDay(eligibleGuards, guardsPTO, workDay)
        addElementsToObjectArrayProperty(scheduleOption, workDay, availableGuards)
    }

    return scheduleOption;
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

        const normalizedDate = (new Date(date)).toLocaleString("en-US").split(', ')[0]
        console.log()
        schedule.push( { date : normalizedDate, guard : flatScheduleGuardOptions.find(g => g._id === leastAvailable.guardId)?.name } )
    })




    return schedule
}

const addElementsToObjectArrayProperty = (object, propertyName, elements) => {
    if(!object[propertyName]) {
        object[propertyName] = []
    }
    object[propertyName].push(...elements)
}


module.exports = { findEligibleGuards, findAvailableGuardsOnDay, getPTOPerGuard, getContractWorkingDays, getScheduleOptions, createSchedule }
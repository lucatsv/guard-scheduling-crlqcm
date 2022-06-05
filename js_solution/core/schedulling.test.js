const { findEligibleGuards, findAvailableGuardsOnDay, getPTOPerGuard, getContractWorkingDays, getScheduleOptions, createSchedule } = require('./schedulling')


test('1. Contract Requires Firearm - Should Return Eligible Guards ', () => {

    const guards = [
        {
            fireArmLicense : true
        },
        {
            fireArmLicense : true
        },
        {
            fireArmLicense : false
        }
    ]

    const contract = {
        requireArmedGuard : true
    }

    expect(findEligibleGuards(guards, contract).length).toBe(2)
})

test('2. Contract Does NOT Require Firearm - Should Return Eligible Guards ', () => {

    const guards = [
        {
            fireArmLicense : true
        },
        {
            fireArmLicense : true
        },
        {
            fireArmLicense : false
        }
    ]

    const contract = {
        requireArmedGuard : false
    }

    expect(findEligibleGuards(guards, contract).length).toBe(3)
})

test('4. Given a contract with Seven days work - it should return the right days of work', () => {
    const contract = {
        daysOfWeek : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    const workingDays = getContractWorkingDays(contract, new Date(2022, 6 - 1, 4), new Date(2022, 6 - 1, 11))
    expect( workingDays.length ).toBe(8)

})

test('5. Given a contract with Seven days work, and an interval of two days - it should return the right days of work', () => {
    const contract = {
        daysOfWeek : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    const workingDays = getContractWorkingDays(contract, new Date(2022, 6 - 1, 4), new Date(2022, 6 - 1, 5))
    expect( workingDays.length ).toBe(2)
})

test('6. Given a Contract, Guards, and PTO List - it should return a list of available guards', () => {
    const guards = [
        {
            _id : '123',
            name: "Matthew",
            fireArmLicense: true
        },
        {
            _id : '456',
            name: "Mark",
            fireArmLicense: false
        },
        {
            _id : '789',
            name: "Luke",
            fireArmLicense : true
        },
        {
            _id : '1011',
            name: "John",
            fireArmLicense : false
        },
    ]

    const contract = {
        _id : '1234567',
        name : "Home Depot",
        daysOfWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        requireArmedGuard : true
    }

    const ptos = [
        {
            guardId : '123',
            date: new Date(2022, 6 - 1, 4)
        },
        {
            guardId : '123',
            date: new Date(2022, 6 - 1, 7)
        },
        {
            guardId : '456',
            date: new Date(2022, 6 - 1, 7)
        },
        {
            guardId : '789',
            date: new Date(2022, 6 - 1, 5)
        },
    ]

    const eligibleGuards = findEligibleGuards(guards, contract)

    const guardsPTO = getPTOPerGuard(ptos)

    const availableGuard = findAvailableGuardsOnDay(eligibleGuards, guardsPTO, new Date(2022, 6 - 1, 4) )

    expect(availableGuard[0]._id).toBe("789")

})

test('7. Given a contract with Seven days work - it should return the right days of work', () => {
    const contract = {
        daysOfWeek : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    const workingDays = getContractWorkingDays(contract, new Date(2022, 6 - 1, 4), new Date(2022, 6 - 1, 11))
    expect( workingDays.length ).toBe(8)

})

test('8. Given a contract with Seven days work, and an interval of two days - it should return the right days of work', () => {
    const contract = {
        daysOfWeek : [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }

    const workingDays = getContractWorkingDays(contract, new Date(2022, 6 - 1, 4), new Date(2022, 6 - 1, 5))
    expect( workingDays.length ).toBe(2)
})

test('9. Given a Contract, and all Guards on PTO on a working day - it should return an empty list of available guards for a certain day', () => {

    const eligibleGuards = findEligibleGuards(mockGuards, mockContract)

    const guardsPTO = getPTOPerGuard(mockPtos)

    const availableGuard = findAvailableGuardsOnDay(eligibleGuards, guardsPTO, new Date(2022, 6 - 1, 4) )

    expect(availableGuard[0]._id).toBe("789")

})

test('10. ', () => {
    
    const options = getScheduleOptions(mockContract, mockGuards, mockPtos, new Date(2022, 6 - 1, 4), new Date(2022, 6 - 1, 6))

    expect(Object.keys(options).length).toBe(3)

    const firstDay = Object.keys(options)[0]
    const guardsAvailableForTheFirstDay = options[firstDay]
    expect(guardsAvailableForTheFirstDay.length).toBe(1)
    expect(guardsAvailableForTheFirstDay[0]._id).toBe('789')

    const secondDay = Object.keys(options)[1]
    const guardsAvailableForTheSecondDay = options[secondDay]
    expect(guardsAvailableForTheSecondDay.length).toBe(2)
    expect(guardsAvailableForTheSecondDay[0]._id).toBe('123')
    expect(guardsAvailableForTheSecondDay[1]._id).toBe('789')

    const thirdDay = Object.keys(options)[2]
    const guardsAvailableForTheThirdDay = options[thirdDay]
    expect(guardsAvailableForTheThirdDay.length).toBe(1)
    expect(guardsAvailableForTheThirdDay[0]._id).toBe('789')

    const schedule = createSchedule(options)

    console.log(schedule)
})

const mockContract = {
    _id : '1234567',
    name : "Home Depot",
    daysOfWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    requireArmedGuard : true
}

const mockGuards = [
    {
        _id : '123',
        name: "Matthew",
        fireArmLicense: true
    },
    {
        _id : '456',
        name: "Mark",
        fireArmLicense: false
    },
    {
        _id : '789',
        name: "Luke",
        fireArmLicense : true
    },
    {
        _id : '1011',
        name: "John",
        fireArmLicense : false
    },
]

const mockPtos = [
    {
        guardId : '123',
        date: new Date(2022, 6 - 1, 4)
    },
    {
        guardId : '123',
        date: new Date(2022, 6 - 1, 6)
    },
    {
        guardId : '456',
        date: new Date(2022, 6 - 1, 4)
    },
    {
        guardId : '789',
        date: new Date(2022, 6 - 1, 3)
    },
]
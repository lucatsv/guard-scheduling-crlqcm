/* eslint-env jest */
const {
    findEligibleGuards,
    findAvailableGuardsOnDay,
    getPTOPerGuard,
    getContractWorkDays,
    getScheduleOptions,
    getScheduleOptionsPerContract,
    createSchedule,
    createScheduleForAllContracts,
    findEligibleGuardsPerContract,
    getContractsWorkDays,
    UNAVAILABLE_GUARDS_ERROR_MESSAGE,
} = require('./schedulling')

const mockContract = {
    _id: '1234567',
    name: 'Home Depot',
    daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    requireArmedGuard: true,
}

const mockOfContractsList = [
    mockContract,
    {
        _id: '89101112',
        name: 'Walmart',
        daysOfWeek: ['Sunday', 'Friday', 'Saturday'],
        requireArmedGuard: false,
    },
]

const mockGuards = [
    {
        _id: '123',
        name: 'Matthew',
        fireArmLicense: true,
    },
    {
        _id: '456',
        name: 'Mark',
        fireArmLicense: false,
    },
    {
        _id: '789',
        name: 'Luke',
        fireArmLicense: true,
    },
    {
        _id: '1011',
        name: 'John',
        fireArmLicense: false,
    },
]

const mockPtos = [
    {
        guardId: '123',
        date: new Date(2022, 6 - 1, 4),
    },
    {
        guardId: '123',
        date: new Date(2022, 6 - 1, 6),
    },
    {
        guardId: '456',
        date: new Date(2022, 6 - 1, 4),
    },
    {
        guardId: '789',
        date: new Date(2022, 6 - 1, 3),
    },
]

test('0. Given Eligible Guards and their PTO schedule - it should return the list of available guards for a given date', () => {
    const eligibleGuards = findEligibleGuards(mockGuards, mockContract)
    const guardsPto = getPTOPerGuard(mockPtos)

    const av4 = findAvailableGuardsOnDay(eligibleGuards, guardsPto, new Date(2022, 6 - 1, 4))
    const av5 = findAvailableGuardsOnDay(eligibleGuards, guardsPto, new Date(2022, 6 - 1, 5))
    const av6 = findAvailableGuardsOnDay(eligibleGuards, guardsPto, new Date(2022, 6 - 1, 6))

    expect(av4.length).toBe(1)
    expect(av5.length).toBe(2)
    expect(av6.length).toBe(1)
})

test('1. Contract Requires Firearm - Should Return Eligible Guards ', () => {
    const guards = [
        {
            fireArmLicense: true,
        },
        {
            fireArmLicense: true,
        },
        {
            fireArmLicense: false,
        },
    ]

    const contract = {
        requireArmedGuard: true,
    }

    expect(findEligibleGuards(guards, contract).length).toBe(2)
})

test('2. Contract Does NOT Require Firearm - Should Return Eligible Guards ', () => {
    const guards = [
        {
            fireArmLicense: true,
        },
        {
            fireArmLicense: true,
        },
        {
            fireArmLicense: false,
        },
    ]

    const contract = {
        requireArmedGuard: false,
    }

    expect(findEligibleGuards(guards, contract).length).toBe(3)
})

test('3. Given a contract with Seven days work - it should return the right days of work', () => {
    const contract = {
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }

    const workingDays = getContractWorkDays(
        contract,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 11),
    )
    expect(workingDays.length).toBe(8)
})

test('4. Given a contract with Seven days work, and an interval of two days - it should return the right days of work', () => {
    const contract = {
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }

    const workingDays = getContractWorkDays(
        contract,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 5),
    )
    expect(workingDays.length).toBe(2)
})

test('5. Given a Contract, Guards, and PTO List - it should return a list of available guards', () => {
    const guards = [
        {
            _id: '123',
            name: 'Matthew',
            fireArmLicense: true,
        },
        {
            _id: '456',
            name: 'Mark',
            fireArmLicense: false,
        },
        {
            _id: '789',
            name: 'Luke',
            fireArmLicense: true,
        },
        {
            _id: '1011',
            name: 'John',
            fireArmLicense: false,
        },
    ]

    const contract = {
        _id: '1234567',
        name: 'Home Depot',
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        requireArmedGuard: true,
    }

    const ptos = [
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 7),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 7),
        },
        {
            guardId: '789',
            date: new Date(2022, 6 - 1, 5),
        },
    ]

    const eligibleGuards = findEligibleGuards(guards, contract)

    const guardsPTO = getPTOPerGuard(ptos)

    const availableGuard = findAvailableGuardsOnDay(
        eligibleGuards,
        guardsPTO,
        new Date(2022, 6 - 1, 4),
    )

    expect(availableGuard[0]._id).toBe('789')
})

test('6. Given a contract with Seven days work - it should return the right days of work', () => {
    const contract = {
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }

    const workingDays = getContractWorkDays(
        contract,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 11),
    )

    expect(workingDays.length).toBe(8)
})

test('7. Given a contract with Seven days work, and an interval of two days - it should return the right days of work', () => {
    const contract = {
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }

    const workingDays = getContractWorkDays(
        contract,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 5),
    )

    expect(workingDays.length).toBe(2)

    const workingEveryDayOfTheYear = getContractWorkDays(
        mockContract,
        new Date(2022, 1 - 1, 1),
        new Date(2022, 12 - 1, 31),
    )
    expect(workingEveryDayOfTheYear.length).toBe(365)

    const mockContractMondaysOnly = {
        _id: '1234567',
        name: 'Home Depot',
        daysOfWeek: ['Monday'],
        requireArmedGuard: true,
    }
    const workingOnMondays = getContractWorkDays(
        mockContractMondaysOnly,
        new Date(2022, 1 - 1, 1),
        new Date(2022, 12 - 1, 31),
    )

    expect(workingOnMondays.length).toBe(52)
})

test('8. Given a Contract, and all Guards on PTO on a working day - it should return an empty list of available guards for a certain day', () => {
    const eligibleGuards = findEligibleGuards(mockGuards, mockContract)

    const guardsPTO = getPTOPerGuard(mockPtos)

    const availableGuard = findAvailableGuardsOnDay(
        eligibleGuards,
        guardsPTO,
        new Date(2022, 6 - 1, 4),
    )

    expect(availableGuard[0]._id).toBe('789')
})

test('9. Given contract, guards, PTO schedule, and range of working days - it should create the contract schedule ', () => {
    const options = getScheduleOptions(
        mockContract,
        mockGuards,
        mockPtos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 6),
    )

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

    expect(schedule.length).toBe(3);
    expect(schedule.filter((s) => s.guard === 'Luke').length).toBe(2);
    expect(schedule.filter((s) => s.guard === 'Matthew').length).toBe(1);
})

test('10. Given contract, all guards in PTO, PTO schedule, and range of working days - it should return error message when cannot find guards ', () => {
    const contract = {
        _id: '1234567',
        name: 'Home Depot',
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        requireArmedGuard: true,
    }

    const guards = [
        {
            _id: '123',
            name: 'Matthew',
            fireArmLicense: true,
        },
        {
            _id: '456',
            name: 'Mark',
            fireArmLicense: false,
        },
    ]

    const ptos = [
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 6),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 6),
        },
    ]

    const options = getScheduleOptions(
        contract,
        guards,
        ptos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 6),
    )

    const schedule = createSchedule(options)

    schedule.forEach((s) => {
        expect(s.message).toBe(UNAVAILABLE_GUARDS_ERROR_MESSAGE)
    })
})

test('11. Given contract, ineligible guards, PTO schedule, and range of working days - it should return error message when cannot find guards ', () => {
    const contract = {
        _id: '1234567',
        name: 'Home Depot',
        daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        requireArmedGuard: true,
    }

    const guards = [
        {
            _id: '123',
            name: 'Matthew',
            fireArmLicense: false,
        },
        {
            _id: '456',
            name: 'Mark',
            fireArmLicense: false,
        },
    ]

    const ptos = [
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 6),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 6),
        },
    ]

    const options = getScheduleOptions(
        contract,
        guards,
        ptos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 6),
    )

    const schedule = createSchedule(options)

    schedule.forEach((s) => {
        expect(s.message).toBe(UNAVAILABLE_GUARDS_ERROR_MESSAGE)
    })
})

test('12. Given list of contracts and list of guards - it should return the list of eligible guards per contract', () => {
    const eligibleGuardsPerContract = findEligibleGuardsPerContract(mockOfContractsList, mockGuards)

    eligibleGuardsPerContract.forEach((egpc) => {
        const contract = mockOfContractsList.find((c) => c._id === egpc.contractId)
        const guardsMeetContractRequirement = egpc.guards.every(
            (g) => g.fireArmLicense === contract.requireArmedGuard,
        )
        expect(guardsMeetContractRequirement).toBe(true)
    })
})

test('13. Given list of contracts and date range - it should return the list of working days per contract', () => {
    const contractsWorkDays = getContractsWorkDays(
        mockOfContractsList,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 7),
    )

    expect(contractsWorkDays[0].workDays.length).toBe(4)
    expect(contractsWorkDays[1].workDays.length).toBe(2)
})

test('14. Given list of contracts, list of guards and their PTO, and date range - it should return schedule options per contract', () => {
    const optionsPerContract = getScheduleOptionsPerContract(
        mockOfContractsList,
        mockGuards,
        mockPtos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 7),
    )
    const contract1FirstDay = (new Date(2022, 6 - 1, 4)).toString()
    expect(optionsPerContract[0].option[contract1FirstDay].length).toBe(1)

    const contract1SecondDay = (new Date(2022, 6 - 1, 5)).toString()
    expect(optionsPerContract[0].option[contract1SecondDay].length).toBe(2)

    const contract1ThirdDay = (new Date(2022, 6 - 1, 6)).toString()
    expect(optionsPerContract[0].option[contract1ThirdDay].length).toBe(1)

    const contract1FourthDay = (new Date(2022, 6 - 1, 7)).toString()
    expect(optionsPerContract[0].option[contract1FourthDay].length).toBe(2)

    const contract2FirstDay = (new Date(2022, 6 - 1, 4)).toString()
    expect(optionsPerContract[1].option[contract2FirstDay].length).toBe(2)

    const contract2SecondDay = (new Date(2022, 6 - 1, 5)).toString()
    expect(optionsPerContract[1].option[contract2SecondDay].length).toBe(4)
})

test('15. Given a List of Contracts, guards and their PTOs, and a date range - it should return the schedule', () => {
    const optionsPerContract = getScheduleOptionsPerContract(
        mockOfContractsList,
        mockGuards,
        mockPtos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 7),
    )

    const schedule = createScheduleForAllContracts(mockOfContractsList, optionsPerContract)

    expect(schedule.filter((s) => s.contract === 'Home Depot').length).toBe(4)
    expect(schedule.filter((s) => s.contract === 'Walmart').length).toBe(2)
    expect(schedule.filter((s) => s.guard === 'Luke').length).toBe(2)
    expect(schedule.filter((s) => s.guard === 'Matthew').length).toBe(2)
    expect(schedule.filter((s) => s.guard === 'John').length).toBe(1)
    expect(schedule.filter((s) => s.guard === 'Mark').length).toBe(1)
})

test('16. Given a List of Contracts and all guards aways - it should return an error message', () => {
    const allGuardsOnPTOForTheGivenRange = [
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '123',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '456',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '789',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '789',
            date: new Date(2022, 6 - 1, 5),
        },
        {
            guardId: '1011',
            date: new Date(2022, 6 - 1, 4),
        },
        {
            guardId: '1011',
            date: new Date(2022, 6 - 1, 5),
        },
    ]

    const optionsPerContract = getScheduleOptionsPerContract(
        mockOfContractsList,
        mockGuards,
        allGuardsOnPTOForTheGivenRange,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 5),
    )

    const schedule = createScheduleForAllContracts(mockOfContractsList, optionsPerContract)

    expect(schedule.every((s) => s.guard === UNAVAILABLE_GUARDS_ERROR_MESSAGE)).toBe(true)
})

test('17. Given a List of Contracts and all guards do NOT meet contract requirement - it should return an error message', () => {
    const guardsDoNotHoldFirearmLicense = [
        {
            _id: '123',
            name: 'Matthew',
            fireArmLicense: false,
        },
        {
            _id: '456',
            name: 'Mark',
            fireArmLicense: false,
        },
    ]

    const optionsPerContract = getScheduleOptionsPerContract(
        [mockContract],
        guardsDoNotHoldFirearmLicense,
        mockPtos,
        new Date(2022, 6 - 1, 4),
        new Date(2022, 6 - 1, 5),
    )

    const schedule = createScheduleForAllContracts(mockOfContractsList, optionsPerContract)

    expect(schedule.every((s) => s.guard === UNAVAILABLE_GUARDS_ERROR_MESSAGE)).toBe(true)
})

module.exports = { 
    mongodbMemoryServerOptions: {
        binary: {
            version: '4.0.3',
            skipMD5: true,
        },
        autoStart: false,
        instance: {
           // dbName: 'jest',use the same database for all tests
        },
    },
    useSharedDBForAllJestWorkers: true,
};
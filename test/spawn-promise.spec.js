describe('SpawnPromise', function(){
    var sut, logger

    beforeEach(function(){
        sut = require('../lib/spawn-promise');
        logger = require('../lib/logger');
    });

    describe('Options parameter', function(){
        it('Should be required', function(){
            logger.err = createSpy('err');
            sut().catch(function(err){});
            expect(logger.err).toHaveBeenCalledWith('spawn Requires an options parameter!');
        });
        it('Should required a command property', function(){
            logger.err = createSpy('err');
            sut({}).catch(function(err){});
            expect(logger.err).toHaveBeenCalledWith('spawn requires a command property on options!');
        });
        it('Should require the args parameter to be an array', function(){
            logger.err = createSpy('err');
            sut({command: 'echo', args:{}}).catch(function(err){});
            expect(logger.err).toHaveBeenCalledWith('options.args must be an array!');
        });
    });
})

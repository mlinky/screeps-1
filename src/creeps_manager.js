const creepsFactory = require('creeps_factory');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleFighter = require('role.fighter');
const roleMineralHarvester = require('role.mineral_harvester');
const roleCarrier = require('role.carrier');
const CreepType = require('enums').CreepType;

const creepsManager = (function(){


    function getMineralHarvestersNeeded() {
        const extractors = Game.spawns['Krakow'].room.find(FIND_STRUCTURES, {filter: (structure) =>  structure.structureType === STRUCTURE_EXTRACTOR});
        if(extractors.length > 0 && Game.spawns['Krakow'].room.find(FIND_MINERALS)[0].mineralAmount > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    function run() {

        const BUILDERS_NEEDED = 1;
        const HARVESTERS_NEEDED = 2;
        const UPGRADERS_NEEDED = 2;
        const MINERS_NEEDED = 0;
        const FIGHTERS_NEEDED = Game.spawns['Krakow'].room.controller.level > 1 ? 3 : 0;
        const MINERAL_HARVESTERS_NEEDED = getMineralHarvestersNeeded();
        const CARRIERS_NEEDED = typeof Game.spawns['Krakow'].room.storage !== 'undefined' ? 1 : 0;

        if (!Game.spawns['Krakow'].spawning) {
            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.HARVESTER && creep.ticksToLive > 50);
            const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.UPGRADER && creep.ticksToLive > 50);
            const builders = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.BUILDER && creep.ticksToLive > 50);
            const fighters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.FIGHTER && creep.ticksToLive > 50);
            const mineral_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.MINERAL_HARVESTER && creep.ticksToLive > 50);
            const carriers = _.filter(Game.creeps, (creep) => creep.memory.role === CreepType.CARRIER && creep.ticksToLive > 50);

            if (harvesters.length < HARVESTERS_NEEDED) {
                creepsFactory.createHarvester();
            } else if (upgraders.length < UPGRADERS_NEEDED) {
                creepsFactory.createUpgrader();
            } else if (builders.length < BUILDERS_NEEDED) {
                creepsFactory.createBuilder();
            } else if (fighters.length < FIGHTERS_NEEDED) {
               creepsFactory.createFighter();
            } else if (fighters.length < MINERS_NEEDED) {
                creepsFactory.createMiner();
            } else if (mineral_harvesters.length < MINERAL_HARVESTERS_NEEDED) {
                creepsFactory.createMineralHarvester();
            } else if (carriers.length < CARRIERS_NEEDED) {
                creepsFactory.createCarrier();
            }
        }

        for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === CreepType.HARVESTER) {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === CreepType.UPGRADER) {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === CreepType.BUILDER) {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === CreepType.FIGHTER) {
                roleFighter.run(creep);
            }
            if (creep.memory.role === CreepType.MINERAL_HARVESTER) {
                roleMineralHarvester.run(creep);
            }
            if (creep.memory.role === CreepType.CARRIER) {
                roleCarrier.run(creep);
            }
        }
    }

    return {
        run: run
    }
})();

module.exports = creepsManager;
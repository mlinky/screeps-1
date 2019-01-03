const roleBuilder = (function(){


    function gatherEnergy(creep) {
        const containers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;
            }
        });

        if (containers.length > 0) {
            if (creep.withdraw(containers[1], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[1]);
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    }

    function run(creep) {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            const constructionSitesIds = Object.getOwnPropertyNames(Game.constructionSites);
            if (constructionSitesIds.length > 0) {
                const unfinishedBuilding = Game.constructionSites[constructionSitesIds[0]];
                if (creep.build(unfinishedBuilding) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(unfinishedBuilding, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                const structuresToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 50000
                });
                if (structuresToRepair.length > 0) {
                    const structureToRepair = structuresToRepair[0];
                    if (creep.repair(structureToRepair) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureToRepair, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }

        } else {
            gatherEnergy(creep);
        }
    }

    return {
        run: run
    }
})();

module.exports = roleBuilder;
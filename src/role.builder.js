const roleBuilder = (function(){
    function gatherEnergy(creep) {
        const source = creep.room.find(FIND_SOURCES)[1];
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                    && structure.pos.findClosestByRange(FIND_SOURCES) === source;
            }
        });
        if (containers.length > 0) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
            }
        } else {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
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
                    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 250000
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


const roleHarvester = (function () {

    function deliverEnergy(creep) {
        const spawnsAndTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        if (spawnsAndTowers.length > 0) {
            if (creep.transfer(spawnsAndTowers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawnsAndTowers[0]);
            }
        } else {
            const closestExtensionWithEnergyNeed = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                        && structure.energy < structure.energyCapacity;
                }
            });

            if (closestExtensionWithEnergyNeed !== null) {
                if (creep.transfer(closestExtensionWithEnergyNeed, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestExtensionWithEnergyNeed);
                }
            }
        }
    }

    function gatherEnergy(creep) {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;
            }
        });

        if (containers.length > 0) {
            if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(containers[0]);
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    }

    function isNearEnergySource(creep) {
        const energySources = creep.room.find(FIND_SOURCES);
        return creep.pos.isNearTo(energySources[1].pos)
    }

    function run(creep) {

        if (creep.carry.energy > 0 && !isNearEnergySource(creep) || creep.carry.energy === creep.carryCapacity) {
            deliverEnergy(creep);
        } else {
            gatherEnergy(creep);
        }
    }

    return {
        run: run
    };
})();

module.exports = roleHarvester;
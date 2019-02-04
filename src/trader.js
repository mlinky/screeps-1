const trader = (function () {

    function tradeResource() {
        for (let room in Game.rooms) {
            const utriumBuyOrders = Game.market.getAllOrders({
                filter: (order) => {
                    return order.type === ORDER_BUY && order.resourceType === RESOURCE_UTRIUM
                        // && Game.market.calcTransactionCost(1000, room, order.roomName) < 5000;
                }});

            console.log(JSON.stringify(utriumBuyOrders));

        }
    }

    function run() {

       if(Game.time % 10 === 0) {
           tradeResource();
       }
    }

    return {
        run: run
    }
})();

module.exports = trader;
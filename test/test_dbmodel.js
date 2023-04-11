const dbmodel = require('../db_model');

const PublicKey = "testtesttesttesttesttest"

async function testdb() {
    // get linktree
    // let linktree = await dbmodel.getLinktree(PublicKey);
    // console.log(linktree);

    // get all linktrees
    await dbmodel.getAllLinktrees();

    // set linktree
    // let linktree2 = {
    //     "name": "test2",
    //     "description": "test2",
    //     "avatar": "test2",
    //     "links": [
    //         {
    //             "name": "test2",
    //             "url": "test2"
    //         }
    //     ]
    // }
    // await dbmodel.setLinktree(PublicKey, linktree2);
}                  

testdb()
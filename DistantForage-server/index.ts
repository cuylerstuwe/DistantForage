const nedb = require("nedb");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const db = new nedb({filename: "db.txt", autoload: true});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/set", async (req, res) => {

    const idToFind = req.body.id;
    const valueToSet = req.body.value;
    const docs = await new Promise(resolve => {
        db.update({id: idToFind}, {id: idToFind, value: valueToSet}, {upsert: true}, (err, numReplaced, upsertDocs) => {
            if(!err) resolve(upsertDocs);
            else { console.error(err); }
        });
    });

    res.send({id: idToFind, value: valueToSet});

});

app.post("/get", async (req, res) => {

    const idToFind = req.body.id;

    const docs = await new Promise(resolve => {
        db.find({id: idToFind}, (err, docs) => {
            if(err) { resolve({error: err}); return; }
            else { resolve(docs); }
        })
    });

    if(Array.isArray(docs) && docs.length === 0) {
        res.send({id: idToFind, value: undefined});
        return;
    }

    res.send({id: docs[0].id, value: docs[0].value});

});

app.post("/remove", async (req, res) => {

    const idToRemove = req.body.id;

    const numberRemoved = await new Promise(resolve => {
        db.remove({id: idToRemove}, {}, (err, numRemoved) => {
            if(err) { resolve(0); return; }
            else { resolve(numRemoved); }
        });
    });

    res.send({numberRemoved});
});

app.post("/keys", async (req, res) => {

    const docs = await new Promise(resolve => {
        db.find({id: {$exists: true}}, (err, docs) => {
            if(err) { resolve([]); return; }
            else { resolve(docs); }
        });
    });

    const keys = (docs as [{id: string}]).map(doc => doc.id);

    res.send(keys);
});

const port = 58008;
app.listen(port, () => { console.log(`Listening on port: ${port}`); });

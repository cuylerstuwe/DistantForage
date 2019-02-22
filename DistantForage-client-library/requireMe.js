// ==UserScript==
// @name         DistantForage Library
// @namespace    salembeats
// @version      1.0
// @description  Local client/server storage solution implementing localForage's main interface. Intended for usage with Tampermonkey userscripts.
// @author       Cuyler Stuwe (salembeats)
// @include      *
// @grant        none
// ==/UserScript==

const DEFAULT_DISTANT_FORAGE_API_ROUTE = "http://127.0.0.1:58008";

class DistantForage {

    constructor(protocolAndIpAndPortString) {
        this.baseUrl = protocolAndIpAndPortString || DEFAULT_DISTANT_FORAGE_API_ROUTE;
    }

    async jsonApiRoute(path, payload) {
        const response = await fetch(`${this.baseUrl}/${path}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const obj = await response.json();
        return obj;
    }

    async setItem(key, val) {
        try {
            await this.jsonApiRoute("set", {id: key, value: val});
        } catch (err) {
            console.error(err);
        }
    }

    async getItem(key) {
        let itemResponse;
        try {
            itemResponse = await this.jsonApiRoute("get", {id: key});
        } catch(err) {
            console.error(err);
            return null;
        }
        return itemResponse.value;
    }

    async removeItem(key) {
        try {
            await this.jsonApiRoute("remove", {id: key});
        } catch(err) {
            console.error(err);
        }
    }

    async keys() {
        let keysArray;
        try {
            keysArray = await this.jsonApiRoute("keys");
        } catch(err) {
            console.error(err);
            return null;
        }
        return keysArray;
    }

}

async function runBasicDistantForageTest() {

    const distantForage = new DistantForage();

    await distantForage.setItem("test", "working");
    const testKey = await distantForage.getItem("test");

    console.assert(testKey === "working");

    let keys = await distantForage.keys();

    console.log(keys);
    console.assert(keys.includes("test"));

    await distantForage.removeItem("test");

    keys = await distantForage.keys();

    console.log(keys);
    console.assert(!keys.includes("test"));
}

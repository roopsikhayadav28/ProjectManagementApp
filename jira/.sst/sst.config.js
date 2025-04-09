"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constructs_1 = require("sst/constructs"); // Correct for constructs
exports.default = {
    config: function (_input) {
        return {
            name: "jira",
            region: "us-east-1",
        };
    },
    stacks: function (app) {
        app.stack(function Site(_a) {
            var stack = _a.stack;
            var site = new constructs_1.NextjsSite(stack, "site", {
                path: ".", // Project root
                environment: {
                    DATABASE_URL: process.env.DATABASE_URL,
                    DIRECT_URL: process.env.DIRECT_URL,
                    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
                    NEXTAUTH_URL: "http://localhost:3000", // Update post-deploy
                },
            });
            stack.addOutputs({
                SiteUrl: site.url,
            });
        });
    },
};

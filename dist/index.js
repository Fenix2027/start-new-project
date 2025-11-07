"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/courses', (req, res) => {
    res.json([
        { id: 1, title: 'front-end' },
        { id: 1, title: 'beck-end' },
        { id: 1, title: 'automtion qa' },
        { id: 1, title: 'devops' }
    ]);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map
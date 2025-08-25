const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));  // 루트 폴더 기준 static 제공

const dataFile = path.join(__dirname, "estimates.json");

// 견적 저장
app.post("/estimate", (req, res) => {
    const estimate = req.body;
    let estimates = [];
    if (fs.existsSync(dataFile)) {
        estimates = JSON.parse(fs.readFileSync(dataFile));
    }

    estimates.push({ id: Date.now(), ...estimate, completed: false, createdAt: new Date() });
    fs.writeFileSync(dataFile, JSON.stringify(estimates, null, 2));
    res.json({ message: "견적 저장 완료!", estimate });
});

// 견적 조회
app.get("/estimates", (req, res) => {
    if (!fs.existsSync(dataFile)) return res.json([]);
    const estimates = JSON.parse(fs.readFileSync(dataFile));
    res.json(estimates);
});

// 완료 처리
app.patch("/estimate/:id/complete", (req, res) => {
    const id = parseInt(req.params.id);
    let estimates = JSON.parse(fs.readFileSync(dataFile));
    estimates = estimates.map(e => e.id === id ? { ...e, completed: true } : e);
    fs.writeFileSync(dataFile, JSON.stringify(estimates, null, 2));
    res.json({ message: "완료 처리 완료" });
});

// 삭제 처리
app.delete("/estimate/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let estimates = JSON.parse(fs.readFileSync(dataFile));
    estimates = estimates.filter(e => e.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(estimates, null, 2));
    res.json({ message: "견적 삭제 완료" });
});

app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}/index.html`));

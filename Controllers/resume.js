const ResumeModel = require("../Modules/resume");
const multer = require("multer");
const PDFParser = require("pdf2json");
const pdfParser = new PDFParser();
const path = require("path");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed"), false);
};
exports.addResume = async (req, res) => {
  try {
    const { job_desc, user } = req.body;

    const pdfPath = req.file.path;
    const fs = require("fs");

    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", async () => {
      try {
        const text = pdfParser.getRawTextContent();

        const prompt = `
You are a resume screening assistant.

Return ONLY:

Score: XX%
Feedback:
- point 1
- point 2
- point 3

IMPORTANT:
- Do NOT include resume text
- Do NOT include "Objective", "Skills", or any sections
- Do NOT repeat "Feedback" twice

Resume:
${text}

Job Description:
${job_desc}
`;

        const response = await cohere.chat({
          model: "command-r-plus-08-2024",
          message: prompt,
          max_tokens: 200,
          temperature: 0.7,
        });

        let result = response.text;

        const match = result.match(/Score:\s*(\d+)/);
        const score = match ? `${match[1]}%` : null;

        const reasonMatch = result.match(/Feedback:\s*([\s\S]*?)(?:Resume:|$)/);
        const reason = reasonMatch ? reasonMatch[1].trim() : null;

        let cleanedFeedback = reason
          ?.replace(/\*\*/g, "")
          .replace(/^Feedback:\s*/i, "") // ✅ REMOVE EXTRA HEADING
          .replace(/- /g, "\n- ")
          .replace(/\n\s*\n/g, "\n")
          .trim();
        const newResume = new ResumeModel({
          user,
          resume_name: req.file.originalname,
          job_desc,
          score: score || null,
          feedback: cleanedFeedback,
        });
        console.log("========== RESULT ==========");
        console.log(`Score: ${score}`);
        console.log("Feedback:\n", cleanedFeedback);
        console.log("============================");
        // console.log("PDF TEXT:\n", text);

        await newResume.save();
        fs.unlinkSync(pdfPath);

        res.status(200).json({
          message: "Analysis ready",
          data: newResume,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });

    pdfParser.on("pdfParser_dataError", (err) => {
      console.error(err);
      res.status(500).json({ error: err.parserError });
    });

    pdfParser.loadPDF(pdfPath);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllResumeForUser = async (req, res) => {
  try {
    const { user } = req.params;
    let resumes = await ResumeModel.find({ user: user }).sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json({ message: "Your Previous History", resumes: resumes });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

exports.getResumeForAdmin = async (req, res) => {
  try {
    const resumes = await ResumeModel.find({})
      .populate("user") // 👈 THIS IS THE FIX
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Fetched All History", resumes: resumes });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

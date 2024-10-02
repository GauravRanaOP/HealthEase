import Test from "../models/Test.js";

export const createTest = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      res.status(404).json({ msg: "Test Data not found" });
    }
    const testdata = new Test();

    testdata.name = data.name;
    testdata.description = data.description;

    const saveTest = await testdata.save();
    res.status(200).json(saveTest);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllTest = async (req, res) => {
  try {
    const TestsData = await Test.find();
    if (!TestsData) {
      res.status(404).json({ msg: "Tests Data not found" });
    }
    res.status(200).json(TestsData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getOneTest = async (req, res) => {
  try {
    const id = req.params.id;
    const TestExist = await Test.findById(id);
    if (!TestExist) {
      res.status(404).json({ msg: "Tests Data not found" });
    }
    res.status(200).json(TestExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateTest = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the Test
    const TestExist = await Test.findById(id);
    if (!TestExist) {
      return res.status(404).json({ msg: "Test Data not found" });
    }
    const updatedTest = await Test.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteTest = async (req, res) => {
  try {
    const id = req.params.id;
    const TestExist = await Test.findById(id);
    if (!TestExist) {
      res.status(404).json({ msg: "Test not exist" });
    }
    await Test.findByIdAndDelete(id);
    res.status(200).json({ msg: "Test Data delete succssfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import Test from "../models/Test.js";
import DiagnosticCenter from "../models/DiagnosticCenter.js";
import Address from "../models/Address.js";

export const getAllTestByName = async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return res.status(400).json({ msg: "Test name is required" });
    }

    // finds all tests that match the name pattern
    const tests = await Test.find({ name: new RegExp(name, "i") });
    if (!tests.length) {
      return res.status(404).json({ msg: "No tests found" });
    }

    // for each test, find diagnostic centers offering it, filtering out tests without any centers
    const results = await Promise.all(
      tests.map(async (test) => {
        const diagnosticCenters = await DiagnosticCenter.find({
          testsOffered: test._id,
        }).populate("addressId");

        // only includes tests with at least one diagnostic center offering it
        if (diagnosticCenters.length > 0) {
          const dcWithAddress = diagnosticCenters.map((dc) => ({
            diagnosticCenterName: dc.name,
            address: {
              streetAddress: dc.addressId.streetAddress,
              city: dc.addressId.city,
              province: dc.addressId.province,
              country: dc.addressId.country,
              postCode: dc.addressId.postCode,
            },
          }));

          return {
            test: {
              _id: test._id,
              name: test.name,
              description: test.description,
            },
            diagnosticCenters: dcWithAddress,
          };
        }
        // return null if no centers offer this test
        return null; 
      })
    );

    // filter out any null values from results array
    const filteredResults = results.filter((result) => result !== null);

    if (!filteredResults.length) {
      return res.status(404).json({ msg: "No centers found offering the requested test(s)" });
    }

    res.status(200).json(filteredResults);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: error.message });
  }
};

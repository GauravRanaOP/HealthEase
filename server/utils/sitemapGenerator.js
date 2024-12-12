import fs from "fs";
import axios from "axios";
import path from "path";

// defines static routes
const staticRoutes = [
  { loc: "/", priority: 1.0 },
  { loc: "/patientDirectory", priority: 0.8 },
  { loc: "/diagnostic-center", priority: 0.8 },
];

// fetches dynamic routes (doctor IDs, test IDs, etc.)
const fetchDynamicRoutes = async (testname) => {
  try {
    // encodes the testname to handle spaces and special characters
    const encodedTestName = encodeURIComponent(testname);

    // fetches all tests
    const testResponse = await axios.get(
      `https://healthease-n5ra.onrender.com/api/test/name?name=${testname}`
    );
    const tests = testResponse.data;

    const dynamicRoutes = [];

    // generates test center URLs for each test
    tests.forEach((test) => {
      dynamicRoutes.push({
        loc: `/testCentersList/${test.test._id}`,
        priority: 0.6,
      });
    });

    return dynamicRoutes;
  } catch (error) {
    console.error("Error fetching dynamic routes:", error);
    return [];
  }
};

// combines static and dynamic routes and generate sitemap.xml
const generateSitemap = async () => {
  // define your test name(s) to be used for dynamic routes
  const testnames = [
    "Hemoglobin A1C Test",
    "Vitamin D Test",
    "COVID-19 Rapid Antigen Test",
  ];

  // const dynamicRoutes = await fetchDynamicRoutes();
  // const dynamicRoutes = [{ loc: "/test", priority: 1.0 }];

  // Fetch dynamic routes for each testname
  const dynamicRoutesPromises = testnames.map((testname) =>
    fetchDynamicRoutes(testname)
  );

  // Wait for all dynamic routes to be fetched
  const dynamicRoutesArrays = await Promise.all(dynamicRoutesPromises);

  // Flatten the array of dynamic routes
  const dynamicRoutes = dynamicRoutesArrays.flat();

  // combines static and dynamic routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // loops through each route and add to sitemap
  allRoutes.forEach((route) => {
    sitemap += `
      <url>
        <loc>http:/localhost:5173${route.loc}</loc>
        <priority>${route.priority}</priority>
      </url>`;
  });

  sitemap += "</urlset>";

  // path for the sitemap.xml file
  const filePath = path.resolve(
    new URL(import.meta.url).pathname,
    "../../../client/public/sitemap.xml"
  );

  // ensures the directory exists before writing the file
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Saves sitemap to the file
  fs.writeFileSync(filePath, sitemap);

  console.log("Sitemap generated successfully.");
};

// runs the sitemap generation
generateSitemap();

import fs from "fs";
import axios from "axios";
import path from "path";

// defines static routes
const staticRoutes = [
  { loc: "/", priority: 1.0 },
  { loc: "/patientDirectory", priority: 0.8 },
  { loc: "/diagnostic-center", priority: 0.8 },
];



// combines static and dynamic routes and generate sitemap.xml
const generateSitemap = async () => {


  // combines static and dynamic routes
  const allRoutes = [...staticRoutes];

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

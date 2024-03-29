import React from "react";

import { baseUrl } from "../baseUrl";
import replaceSpecChars from "../utils/replaceSpecChars";

const EXTERNAL_DATA_URL = `${baseUrl}/api/posts?pagination[limit]=100000000&sort[0]=createdAt:desc`;

const createSitemap = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://www.blog.chaindustry.io/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
  </url>
     <url>
       <loc>${`https://www.blog.chaindustry.io/posts`}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
     </url>
        ${posts
          .map(({ id, attributes }) => {
            return `
                <url>
                    <loc>${`https://www.blog.chaindustry.io/posts/${replaceSpecChars(
                      attributes?.title
                    )}?pid=${id}`}</loc>
                      <lastmod>${new Date().toISOString()}</lastmod>
                </url>
            `;
          })
          .join("")}
           
    </urlset>
    `;
class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const request = await fetch(EXTERNAL_DATA_URL);
    const resp = await request.json();
    const posts = resp.data;
    console.log(posts);

    res.setHeader("Content-Type", "text/xml");
    res.write(createSitemap(posts));
    res.end();
  }
}

export default Sitemap;

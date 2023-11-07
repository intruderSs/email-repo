import React, { useState, useEffect } from "react";

function EmailLinkExtractor() {
  const [links, setLinks] = useState([]);

  const [filteredLinks, setFilteredLinks] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const emailContent = e.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(emailContent, "text/html");

        // Extract and decode links from anchor tags
        const anchorTags = doc.querySelectorAll("a");

        const extractedLinks = Array.from(anchorTags).map((anchor) =>
          decodeURIComponent(anchor.href)
        );
        setLinks(extractedLinks);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    let filtered = [];
    links.forEach((element) => {
      if (
        !element.includes("view.explore") &&
        !element.includes("profile_center") &&
        !element.includes("subscription_center") &&
        !element.includes("unsub_center")
      ) {
        filtered.push(element);
      }
    });
    setFilteredLinks(filtered);
  }, [links]);

  const handleValidate = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ links : filteredLinks })
      }
    );
    if (response.ok) {
      const jsonData = await response.json(); // Parse JSON response from the server
      console.log(jsonData); // Log the JSON data received from the server
    } else {
      console.error("Request failed with status: " + response.status);
    }

    // filteredLinks.forEach(async (element) => {
    //   // window.open(element, "_blank");
    //   return await new Promise((resolve, reject) => {
    //     fetch('/proxy' + element, {
    //       mode: 'no-cors',
    //       method: "GET",
    //       headers: {
    //         'Content-Type': 'application/json',
    //         "Access-Control-Allow-Origin": "*",
    //       }
    //     })
    //       .then(res => {
    //         console.log(res.url);
    //         resolve(res);
    //       })
    //       .catch(err => {
    //         reject(err);
    //         console.log(err);
    //       })
    //   })
    // });
  };

  console.log("Filtered Links", filteredLinks);

  return (
    <>
      <div>
        <input type="file" accept=".htm" onChange={handleFileChange} />
        <div>
          <h2>Extracted Links:</h2>
          <ul>
            {links.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
        <div className="text-center p-3">
          <button
            className="mx-3 btn"
            onClick={handleValidate}
            style={{ background: "#1798c1", color: "#fff" }}
          >
            Validate
          </button>
        </div>
      </div>
    </>
  );
}

export default EmailLinkExtractor;

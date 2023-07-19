import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tableData, setData] = useState([]);
  const [branch2Data, setBranch2Data] = useState([]);
  const [branch3Data, setBranch3Data] = useState([]);
  const [updatedResults, setUpdatedResults] = useState([]);
  const [merged1and2, setMerged1and2] = useState();
  const [tabData, setTabData] = useState();
  const [totalSold, setTotalSold] = useState();
  const [search, setSearch] = useState();

  useEffect(() => {
    fetch("branch1.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("b1", data.products);
        console.log(data.products);

        setData(data.products);
      });
    fetch("branch2.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.products);
        setBranch2Data(data.products);
      });
    fetch("branch3.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBranch3Data(data.products);
      });
  }, []);
  useEffect(() => {
    mergeBranches();
  }, [tableData, branch2Data, branch3Data]);

  const mergeBranches = () => {
    let products = [tableData, branch2Data, branch2Data];
    const groupeObjects = {};
    let arr = [];
    products.forEach((array) => {
      array.forEach((element) => {
        if (groupeObjects.hasOwnProperty(element.id)) {
          groupeObjects[element.id].sold += element.sold;
        } else {
          groupeObjects[element.id] = { ...element };
        }
      });
    });

    setUpdatedResults(groupeObjects);
    console.log("grp", groupeObjects);
    let totalSold = 0;
    {
      Object.entries(groupeObjects).map(([id, product]) => {
        arr.push(product);
        totalSold += product.sold;
      });
    }
    console.log("arr nrww", totalSold);
    arr.sort(function (a, b) {
      console.log("p", a, b);
      while (a.name != b.name) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return textA < textB ? -1 : (textA = textB ? 0 : 1);
      }
    });
    setMerged1and2(arr);
    setTabData(arr);
    setTotalSold(totalSold);
  };

  const searcByName = (e) => {
    if (e.target.value.length > 0) {
      setSearch(e.target.value);
      let result = merged1and2.filter((o) => o.name.includes(e.target.value));
      let sum = 0;
      result.map((product) => {
        sum += product.sold;
      });
      setMerged1and2(result);
      setTotalSold(sum);
    } else {
      setSearch("");
      setMerged1and2(tabData);
    }
  };

  return (
    <div>
      <div className="main_div">
        <h1>Product List</h1>
        <input
          type="search"
          name="search-form"
          id="search-form"
          className="search-input"
          placeholder="Search for..."
          value={search}
          onChange={(e) => searcByName(e)}
        />
        <div>
          <div class="table-wrapper">
            <table class="fl-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Sold</th>
                </tr>
              </thead>
              <tbody>
                {merged1and2 &&
                  merged1and2.map((obj) => (
                    <tr>
                      <td>{obj.name}</td>
                      <td>{obj.sold}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2>Total Revenue:{totalSold}</h2>
      </div>
    </div>
  );
};
export default App;

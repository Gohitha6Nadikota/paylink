import React, { useEffect, useState } from "react";
import { items as ProductDetails } from "../../data";

const HomeScreen = (items) => {
  const modes = ["One time Payment", "Subscription"];
  const [productName, setProductName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [priceId, setPriceId] = useState("");
  const [buttonName, setButtonName] = useState("Generate Link");
  const [modeName, setModeName] = useState("");
  const handleOptionChange = (event) => {
    if (buttonName != "Generate Link") setButtonName("Generate Link");
    const selectedIndex = event.target.selectedIndex - 1;
    setData(selectedOption[selectedIndex]);
    setPriceId(selectedOption[selectedIndex]["Price ID"]);
  };

  const fetchProductMappedData = (productname) => {
    if (buttonName != "Generate Link") setButtonName("Generate Link");
    const filteredProductsArray = ProductDetails.filter((item) => {
      return item["Product Name"] === productname;
    });
    if (filteredProductsArray.length === 0) {
      setSelectedOption(null);
    } else {
      setSelectedOption(filteredProductsArray);
    }
  };
  const handleInputChange = (e) => {
    if (buttonName != "Generate Link") setButtonName("Generate Link");
    setUser(e.target.value);
  };
  useEffect(() => {
    if (productName.length !== 0) {
      fetchProductMappedData(productName);
    }
  }, [productName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (priceId && modeName && user) {
      const url = `https://us-central1-tlloanapp-d0571.cloudfunctions.net/stripePayment/purchase/${user}/${priceId}?mode=${
        modeName === "One time Payment" ? "payment" : "subscription"
      }`;

      navigator.clipboard
        .writeText(url)
        .then(() => {
          setButtonName("Link copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <form
      className="min-h-[100vh] h-auto w-[100vw] flex flex-col p-2 bg-white gap-5 items-center text-sm justify-center"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5 h-auto w-full md:w-[60vw] p-5 rounded-md shadow-lg border border-gray-300 items-center justify-start">
        <h1 className="text-2xl text-center font-semibold w-full">
          Payment Details
        </h1>
        <div className="flex flex-col gap-5 overflow-y-auto h-auto text-sm w-full">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">User Id</label>
            <input
              placeholder="Enter User Id"
              value={user}
              onChange={handleInputChange}
              required
              className="h-10 bg-white border border-gray-400 rounded-lg px-3"
            />
          </div>
          <div className="flex relative flex-col gap-2">
            <label className="font-semibold">Product Name</label>
            <select
              required
              defaultValue=""
              className="h-10 bg-white border border-gray-400 rounded-lg px-3"
              onChange={(e) => {
                setProductName(items.items[e.target.selectedIndex - 1]);
              }}
            >
              <option disabled value="">
                Select Product
              </option>
              {items.items.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Product Variant</label>
            <select
              className="h-10 bg-white border border-gray-400 rounded-lg px-3"
              onChange={handleOptionChange}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select Variant
              </option>
              {selectedOption && (
                <>
                  {selectedOption.map((option, index) => (
                    <option key={index} value={option["Price ID"]}>
                      {option.Amount} {option.Currency}{" "}
                      {option["Billing Scheme"]}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {data && (
            <div className="mt-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  {data["Price ID"] && (
                    <p className="font-semibold">
                      Price ID:{" "}
                      <span className="font-normal">{data["Price ID"]}</span>
                    </p>
                  )}
                  {data["Product ID"] && (
                    <p className="font-semibold">
                      Product ID:{" "}
                      <span className="font-normal">{data["Product ID"]}</span>
                    </p>
                  )}
                  {data["Product Name"] && (
                    <p className="font-semibold">
                      Product Name:{" "}
                      <span className="font-normal">
                        {data["Product Name"]}
                      </span>
                    </p>
                  )}
                  {data.Interval && (
                    <p className="font-semibold">
                      Interval:{" "}
                      <span className="font-normal">{data.Interval}</span>
                    </p>
                  )}
                  {data["Interval Count"] && (
                    <p className="font-semibold">
                      Interval Count:{" "}
                      <span className="font-normal">
                        {data["Interval Count"]}
                      </span>
                    </p>
                  )}
                  {data["Product Statement Descriptor"] && (
                    <p className="font-semibold">
                      Product Statement Descriptor:{" "}
                      <span className="font-normal">
                        {data["Product Statement Descriptor"]}
                      </span>
                    </p>
                  )}
                  {data["Product Tax Code"] && (
                    <p className="font-semibold">
                      Product Tax Code:{" "}
                      <span className="font-normal">
                        {data["Product Tax Code"]}
                      </span>
                    </p>
                  )}
                  {data["Description"] && (
                    <p className="font-semibold">
                      Description:{" "}
                      <span className="font-normal">{data["Description"]}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex md:flex-row flex-col gap-2">
                    {data.Amount && (
                      <p className="font-semibold">
                        Amount:{" "}
                        <span className="font-normal">{data.Amount}</span>
                      </p>
                    )}
                    {data.Currency && (
                      <p className="font-semibold">
                        Currency:{" "}
                        <span className="font-normal">{data.Currency}</span>
                      </p>
                    )}
                    {data["Billing Scheme"] && (
                      <p className="font-semibold">
                        Billing Scheme:{" "}
                        <span className="font-normal">
                          {data["Billing Scheme"]}
                        </span>
                      </p>
                    )}
                  </div>
                  {data["Usage Type"] && (
                    <p className="font-semibold">
                      Usage Type:{" "}
                      <span className="font-normal">{data["Usage Type"]}</span>
                    </p>
                  )}
                  {data["Aggregate Usage"] && (
                    <p className="font-semibold">
                      Aggregate Usage:{" "}
                      <span className="font-normal">
                        {data["Aggregate Usage"]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex relative flex-col gap-2">
            <label className="font-semibold">Mode</label>
            <select
              required
              defaultValue=""
              className="h-10 bg-white border border-gray-400 rounded-lg px-3"
              onChange={(e) => {
                if (buttonName != "Generate Link")
                  setButtonName("Generate Link");
                setModeName(modes[e.target.selectedIndex - 1]);
              }}
            >
              <option disabled value="">
                Select Mode
              </option>
              {modes.map((mode, index) => (
                <option key={index} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="h-10 bg-blue-500 text-white rounded-md px-5 hover:bg-blue-600"
      >
        {buttonName}
      </button>
    </form>
  );
};

export default HomeScreen;

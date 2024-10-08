import React, { useEffect, useState } from 'react';
import {items as ProductDetails} from '../../data';

const HomeScreen = (items) => {
    
    const [completeData,setCompleteData]=useState([]);
    const [productName, setProductName] = useState('');
    const [showProductNameSuggestions, setShowProductNameSuggestions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productsPage, setProductsPage] = useState(1);
    const [isLoading,setLoading] = useState(false);
    const [priceId,setPriceId]=useState('');
    const[data,setData]=useState(null);
    const [user,setUser]=useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const fetchPaginatedData = (pageNumber=1, pageLimit=5 , data)=>{
        const startIndex = (pageNumber - 1) * pageLimit;
        const endIndex = startIndex + pageLimit;
        return data.slice(startIndex, endIndex);
    }
    const handleOptionChange = (event) => {
        const selectedIndex = event.target.selectedIndex;
        setData(selectedOption[selectedIndex]);
        setPriceId(selectedOption[selectedIndex]['Price ID']);
      };
    const onScrolled = (event) => {
        setLoading(true);
        const offset = 1000; 
        if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - offset) {
            setFilteredProducts([...filteredProducts, ...fetchPaginatedData(productsPage, 5, completeData)]);
            setProductsPage(productsPage + 1);
        }
        setLoading(false);
    };

    const fetchProductMappedData = (productname) => {
        const filteredProductsArray = ProductDetails.filter((item) =>{
             return (item["Product Name"]==productname)
            });
        if(filteredProductsArray.length === 0){
            setSelectedOption(null);
        }
        else{
        setSelectedOption(filteredProductsArray);
        setData(filteredProductsArray[0]);
        setPriceId(filteredProductsArray[0]['Price ID'])
        }

    }

    useEffect(()=>{
       setCompleteData(items.items);
       setFilteredProducts(fetchPaginatedData(productsPage, 5, items.items));
       setProductsPage(productsPage + 1);
    },[]);

    useEffect(()=>{
        if(productName.length != 0){
            fetchProductMappedData(productName);
        }   
    },[productName]);
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(priceId)
        {
            const url=`https://us-central1-tlloanapp-d0571.cloudfunctions.net/stripePayment/purchase/${user}/${priceId}?mode=subscription`;
            navigator.clipboard.writeText(url)
            .then(() => {
                alert('Payment link copied to clipboard!'); 
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }
    return (
        <form className='h-[100vh] w-[100vw] p-10 flex flex-col gap-5 items-center overflow-hidden' onSubmit={handleSubmit}>
            
            <div className='h-full min-w-[1000px] flex flex-col gap-5 overflow-scroll no-scrollbar  p-10 rounded-md shadow-lg shadow-[#2b292a7b] max-w-[1000px] border border-[#08080837] '>
                <h1 className='text-[1.65rem] text-center font-semibold'>Payment Details</h1>
                <div className='flex flex-col gap-5 h-full overflow-y-scroll no-scrollbar'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>User Id</label>
                        <input placeholder='Enter your User Id'value={user} onChange={(e)=>setUser(e.target.value)} required className='h-[40px] bg-white border mx-3 px-2 border-black rounded-lg'/>
                    </div>
                    <div className='flex relative flex-col gap-2'>
                        <label className='font-semibold'>Product Name</label>
                       <input value={productName}  required 
                       onChange={(e)=>{
                        if(e.target.value.length === 0){
                            setCompleteData(items)
                            setShowProductNameSuggestions(false)
                        }
                        else{

                            setShowProductNameSuggestions(true)
                            const filteredProductsArray = items.items.filter((item) => item.toLowerCase().includes(e.target.value.toLowerCase()));
                            setCompleteData(filteredProductsArray);
                            setFilteredProducts(fetchPaginatedData(1, 5, filteredProductsArray));
                            setProductsPage(1);
                        }
                        setProductName(e.target.value)
                        }} placeholder='Enter your Product Name' className='h-[40px]  bg-white border mx-3 px-2 border-black rounded-lg'/>
                       {
                            showProductNameSuggestions && (
                                 <div onScroll={(e)=>{onScrolled(e)}} className='h-[250px] no-scrollbar border shadow-md shadow-[#1b1a1a7d]  w-[97.5%] top-[73px] absolute z-10 bg-white rounded-b-lg mx-3 overflow-y-scroll flex flex-col gap-2'>
                                      {filteredProducts.map((item, index) => (
                                        <div 
                                        onClick={()=>{
                                            setProductName(item)
                                            setShowProductNameSuggestions(false)
                                        }} key={index} className=' p-4 cursor-pointer hover:bg-[#615e5e20] '>{item}</div>
                                      ))}
                                        {isLoading && <div className='text-center h-full flex flex-col justify-end text-white bg-blue-400 p-2'>Loading...</div>}
                                 </div>
                            )
            
                       }
                    </div>
                    {
                        selectedOption && (
                            <div className='flex flex-col gap-2'>
                                <label className='font-semibold'>Product Variant</label>
                                <select id="select" className='h-[40px] bg-white border mx-3 px-2 border-black rounded-lg flex overflow-scroll' onChange={handleOptionChange}>
                                    {selectedOption.map((option, index) => (
                                        <option key={index} value={option['Price ID']} 
                                        >{option.Amount} {option.Currency} {option['Billing Scheme'] }</option>
                                    ))}
                                </select>
                            </div>
                        )

                    }
                    {
  data && (
    <div className='mt-4 p-4 border border-2 rounded-lg'>
      <h3 className='text-lg font-semibold'>Details</h3>
      <div className='flex flex-wrap pt-4'>
        <div className='w-1/2 flex flex-col gap-2'>
          {data['Price ID'] && <p className="font-semibold">Price ID: <span className='font-normal'>{data['Price ID']}</span></p>}
          {data['Product ID'] && <p className="font-semibold">Product ID: <span className='font-normal'>{data['Product ID']}</span></p>}
          {data['Product Name'] && <p className="font-semibold">Product Name: <span className='font-normal'>{data['Product Name']}</span></p>}
          {data.Interval && <p className="font-semibold">Interval: <span className='font-normal'>{data.Interval}</span></p>}
          {data['Interval Count'] && <p className="font-semibold">Interval Count: <span className='font-normal'>{data['Interval Count']}</span></p>}
          {data['Product Statement Descriptor'] && <p className="font-semibold">Product Statement Descriptor: <span className='font-normal'>{data['Product Statement Descriptor']}</span></p>}
          {data['Product Tax Code'] && <p className="font-semibold">Product Tax Code: <span className='font-normal'>{data['Product Tax Code']}</span></p>}
          {data['Description'] && <p className="font-semibold">Description: <span className='font-normal'>{data['Description']}</span></p>}
        </div>
        <div className='w-1/2 flex flex-col gap-2'>
          <div className='flex gap-2'>
            {data.Amount && <p className="font-semibold">Amount: <span className='font-normal'>{data.Amount}</span></p>}
            {data.Currency && <p className="font-semibold">Currency: <span className='font-normal'>{data.Currency}</span></p>}
            {data['Billing Scheme'] && <p className="font-semibold">Billing Scheme: <span className='font-normal'>{data['Billing Scheme']}</span></p>}
          </div>
          {data['Usage Type'] && <p className="font-semibold">Usage Type: <span className='font-normal'>{data['Usage Type']}</span></p>}
          {data['Aggregate Usage'] && <p className="font-semibold">Aggregate Usage: <span className='font-normal'>{data['Aggregate Usage']}</span></p>}
          {data['Trial Period Days'] && <p className="font-semibold">Trial Period Days: <span className='font-normal'>{data['Trial Period Days']}</span></p>}
          {data['Tax Behavior'] && <p className="font-semibold">Tax Behavior: <span className='font-normal'>{data['Tax Behavior']}</span></p>}
        </div>
      </div>
    </div>
  )
}

                </div>
                <div className='flex flex-col justify-end'>
                    <button type="submit" className='text-center rounded-lg py-[10px] hover:border-transparent hover:bg-blue-400 px-4 text-white text-[1.5rem] font-semibold bg-blue-700' >Generate Payment Link</button>
                </div>
            </div>
        </form>
    );
};

export default HomeScreen;
import React,{useEffect , useState} from 'react'
import Chart from 'react-apexcharts'
import moment from 'moment';
import { BoxesLoader } from "react-awesome-loaders";
import axios from 'axios'

export interface LineChartProps {
  data?: Array<any>;
  width?: number | string;
  height?: number | string;
}
const LineChart: React.FC<LineChartProps> = ({
  data = [],
  width = 500,
  height = 200,
}) => {

  const [loader,setLoader]=useState(false)
  const input= localStorage.getItem('InputAddress');
  console.log("inputin table",input)
  const options = {
    chart: {
      height,
      toolbar: {
        show: true
      },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: 'smooth' as any
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      row: {
        colors: ['rgba(0, 0, 0, 0.4)'],
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      axisBorder: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
    },
  }
};

  const [priceData, setPriceData] = useState([
    {
      data: [{
          x: moment(new Date(1538778600000)).format('YYYY:mm:DD'),
          y: [6629.81, 6650.5, 6623.04, 6633.33]
        },
        {
          x: moment(new Date(1538780400000)).format('YYYY:mm:DD'),
          y: [6632.01, 6643.59, 6620, 6630.11]
        },
        {
          x: moment(new Date(1538782200000)).format('YYYY:mm:DD'),
          y: [6630.71, 6648.95, 6623.34, 6635.65]
        },
        {
          x: moment(new Date(1538784000000)).format('YYYY:mm:DD'),
          y: [6635.65, 6651, 6629.67, 6638.24]
        },
    
    
      ]
    }
  ])
  
  const Get_data = `
  {
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 300, desc: "timeInterval.minute"}
        date: {since: "2021-05-01"}
        exchangeName: {in: ["Pancake", "Pancake v2"]}
        baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
        quoteCurrency: {is: "${input}"}
      ) {
        timeInterval {
            minute(count: 5)
          }
          baseCurrency {
            symbol
            address
          }
          baseAmount
          quoteCurrency {
            symbol
            address
          }
          quoteAmount
          trades: count
          quotePrice
          maximum_price: quotePrice(calculate: maximum)
          minimum_price: quotePrice(calculate: minimum)
          median_price: quotePrice(calculate: median)
          open_price: minimum(of: block, get: quote_price)
          close_price: maximum(of: block, get: quote_price)
      }
    }
  }`  

  const fetchData = async () =>{
   
    if(input){
      const queryResult= await axios.post('https://graphql.bitquery.io/',{query: Get_data});

      const values :any = [
        {
          data : []
        }
      ];
  
      if(queryResult.data.data){
        queryResult.data.data.ethereum.dexTrades.map(e =>{
          values[0].data.push({
            x : e.timeInterval.minute,
            y : [parseFloat(e.open_price),parseFloat(e.maximum_price), parseFloat(e.minimum_price) , parseFloat(e.close_price) ]
          });
          return {}
        })
        setPriceData(values);
        setLoader(false);
      }

    }
   
   
    }
  

    useEffect(()=>{
      fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps 
  },[input])
  
  return (
    <>
     {loader?<BoxesLoader
    
    boxColor="#8b2a9b"
    shadowColor="#aa8929"
    style={{ marginBottom: "20px" }}
    desktopSize="30px"
    mobileSize="15px"
  />:""}
     {priceData[0] ? <Chart options={options} type='candlestick' series={priceData} width={width} height={height} /> :""}
    </>
  
  );
};

export default LineChart;
 

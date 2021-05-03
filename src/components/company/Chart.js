import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from "axios";

import {useDispatch ,useSelector } from "react-redux";




const COLORS = ['#0088FE', '#00C49F'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}% `}
    </text>
  );
};


  
 
export default class Chart extends PureComponent {

  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

  constructor(props){
    super(props);
    this.state = {
  Providers: 0 , 
  Deliveries : 0, 
  data :  [
    { name: 'Group A', value: 0 },
    { name: 'Group B', value: 0},
  ]
    }
  }

  componentWillMount() {
    console.log("avantttt");

    axios.post( `http://localhost:5000/livraison/getNombreDeliveryByProviderBySociete `, {
        id: JSON.parse(localStorage.getItem("userInfo")).id,
    }).then((res) => {
      this.setState({Providers : res.data.Providers});
       console.log("Providers",this.state.Providers);
    
   

    axios.get( "http://localhost:5000/livraison/getNombreDelivery").then((res) => {
        this.setState({deliveries : res.data.Deliveries});
       console.log("deliveries : ",this.state.deliveries);
      

       this.setState({data :  [
        { name: 'Group A', value: this.state.Providers },
        { name: 'Group B', value: this.state.deliveries },
      ]});
    
    }); 
}); 
  }


  render() {
    return (
        <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
      <h1> the statistics of the providers who are assigned to a delivery compared to the number of deliveries</h1>
    
        <PieChart width={400} height={400}  >
       
          <Pie
            data={this.state.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {this.state.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
       
        </PieChart>
        <div style={{color: "#0088FE" }}> <h3> Providers </h3>  </div> 
            <div style={{color: "#00C49F"}}> <h3> deliveries </h3>  </div>
        </div>
      </div>
    );
  }
}

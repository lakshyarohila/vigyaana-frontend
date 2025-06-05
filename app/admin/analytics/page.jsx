'use client';

import { useEffect, useState, useRef } from 'react';

import * as d3 from 'd3'
import { getRequest } from '@/lib/api';
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// D3 Line Chart Component
const LineChart = ({ data, width = 500, height = 300 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalRevenue)])
      .range([innerHeight, 0]);

    const line = d3.line()
      .x(d => xScale(d.label) + xScale.bandwidth() / 2)
      .y(d => yScale(d.totalRevenue))
      .curve(d3.curveMonotoneX);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", innerHeight)
      .attr("x2", 0).attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#e17100")
      .attr("stop-opacity", 0.1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e17100")
      .attr("stop-opacity", 0.8);

    // Add area under line
    const area = d3.area()
      .x(d => xScale(d.label) + xScale.bandwidth() / 2)
      .y0(innerHeight)
      .y1(d => yScale(d.totalRevenue))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)")
      .attr("d", area);

    // Add line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e17100")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.totalRevenue))
      .attr("r", 5)
      .attr("fill", "#e17100")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", "#374151");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => `₹${d >= 1000 ? d/1000 + 'k' : d}`))
      .selectAll("text")
      .style("fill", "#374151");

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background", "#1c4645")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("opacity", 0)
      .style("pointer-events", "none")
      .style("z-index", 1000);

    g.selectAll(".dot")
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${d.label}: ₹${d.totalRevenue.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        d3.select(this).attr("r", 7);
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
        d3.select(this).attr("r", 5);
      });

    return () => {
      d3.select("body").selectAll(".d3-tooltip").remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

// D3 Bar Chart Component
const BarChart = ({ data, width = 500, height = 300, color = "#1c4645", horizontal = false }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: horizontal ? 100 : 40, left: horizontal ? 150 : 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dataKey = data[0].totalUsers !== undefined ? 'totalUsers' : 'enrollments';
    const labelKey = data[0].title !== undefined ? 'title' : 'label';

    let xScale, yScale;

    if (horizontal) {
      xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[dataKey])])
        .range([0, innerWidth]);

      yScale = d3.scaleBand()
        .domain(data.map(d => d[labelKey]))
        .range([0, innerHeight])
        .padding(0.1);
    } else {
      xScale = d3.scaleBand()
        .domain(data.map(d => d[labelKey]))
        .range([0, innerWidth])
        .padding(0.1);

      yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[dataKey])])
        .range([innerHeight, 0]);
    }

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add bars
    const bars = g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", color)
      .attr("rx", 4)
      .attr("ry", 4);

    if (horizontal) {
      bars
        .attr("x", 0)
        .attr("y", d => yScale(d[labelKey]))
        .attr("width", 0)
        .attr("height", yScale.bandwidth())
        .transition()
        .duration(800)
        .attr("width", d => xScale(d[dataKey]));
    } else {
      bars
        .attr("x", d => xScale(d[labelKey]))
        .attr("y", innerHeight)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(800)
        .attr("y", d => yScale(d[dataKey]))
        .attr("height", d => innerHeight - yScale(d[dataKey]));
    }

    // Add axes
    if (horizontal) {
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("fill", "#374151");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("fill", "#374151")
        .style("font-size", "12px");
    } else {
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("fill", "#374151")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("fill", "#374151");
    }

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background", "#1c4645")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("opacity", 0)
      .style("pointer-events", "none")
      .style("z-index", 1000);

    bars
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${d[labelKey]}: ${d[dataKey]}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
        d3.select(this).attr("opacity", 1);
      });

    return () => {
      d3.select("body").selectAll(".d3-tooltip").remove();
    };
  }, [data, width, height, color, horizontal]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const init = async () => {
      await checkAuth(); // ensure user is loaded
      setIsLoading(false);
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const fetchAll = async () => {
      try {
        console.log('🚀 Fetching analytics data...');
        
        const [statsRes, revenueRes, usersRes, popularRes] = await Promise.all([
          getRequest('/admin/stats'),
          getRequest('/admin/stats/revenue'),
          getRequest('/admin/stats/users'),
          getRequest('/admin/stats/popular-courses'),
        ]);

        // Debug logging
        console.log('📊 Stats Response:', statsRes);
        console.log('💰 Revenue Response:', revenueRes);
        console.log('👥 Users Response:', usersRes);
        console.log('🏆 Popular Courses Response:', popularRes);

        // Check data structure
        console.log('Revenue Data Structure:', {
          isArray: Array.isArray(revenueRes),
          length: revenueRes?.length || 0,
          firstItem: revenueRes?.[0],
          hasRequiredFields: revenueRes?.[0]?.label && revenueRes?.[0]?.totalRevenue !== undefined
        });

        console.log('User Data Structure:', {
          isArray: Array.isArray(usersRes),
          length: usersRes?.length || 0,
          firstItem: usersRes?.[0],
          hasRequiredFields: usersRes?.[0]?.label && usersRes?.[0]?.totalUsers !== undefined
        });

        console.log('Popular Courses Structure:', {
          isArray: Array.isArray(popularRes),
          length: popularRes?.length || 0,
          firstItem: popularRes?.[0],
          hasRequiredFields: popularRes?.[0]?.title && popularRes?.[0]?.enrollments !== undefined
        });

        // Safe data handling with validation
        setStats(statsRes || {});
        
        // Ensure arrays and validate structure
        const safeRevenueData = Array.isArray(revenueRes) 
          ? revenueRes.filter(item => item && item.label && typeof item.totalRevenue === 'number')
          : [];
        
        const safeUserData = Array.isArray(usersRes)
          ? usersRes.filter(item => item && item.label && typeof item.totalUsers === 'number')
          : [];
        
        const safePopularCourses = Array.isArray(popularRes)
          ? popularRes.filter(item => item && item.title && typeof item.enrollments === 'number')
          : [];
        
        setRevenueData(safeRevenueData);
        setUserData(safeUserData);
        setPopularCourses(safePopularCourses);
        
        // Log final data for debugging
        console.log('Final processed data:', {
          revenue: safeRevenueData,
          users: safeUserData,
          courses: safePopularCourses
        });

      } catch (err) {
        console.error('❌ Error fetching analytics:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        toast.error('Failed to fetch analytics data');
        
        // Set empty arrays on error
        setRevenueData([]);
        setUserData([]);
        setPopularCourses([]);
      }
    };

    fetchAll();
  }, [user]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-xl font-medium text-[#1c4645] animate-pulse">
            Loading Admin Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-bold text-[#1c4645] mb-8">📊 Admin Analytics Dashboard</h1>

      {/* Debug Info */}
    
      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.users || 0 },
            { label: 'Total Courses', value: stats.courses || 0 },
            { label: 'Total Enrollments', value: stats.enrollments || 0 },
            { label: 'Total Reviews', value: stats.reviews || 0 },
            { label: 'Total Revenue', value: `₹${stats.revenue || 0}` },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-[#f1f5f9] border-l-4 border-[#1c4645] rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-sm text-gray-500 font-medium mb-2">{item.label}</h2>
              <p className="text-2xl font-bold text-[#1c4645]">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-bold mb-4 text-[#1c4645]">📈 Monthly Revenue</h2>
          {revenueData && revenueData.length > 0 ? (
            <div className="flex justify-center">
              <LineChart data={revenueData} width={450} height={300} />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No revenue data available</p>
                <p className="text-sm mt-2">Check console for API response details</p>
              </div>
            </div>
          )}
        </div>

        {/* New Users Chart */}
        <div className="bg-white border border-gray-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-bold mb-4 text-[#1c4645]">👤 Monthly New Users</h2>
          {userData && userData.length > 0 ? (
            <div className="flex justify-center">
              <BarChart data={userData} width={450} height={300} color="#1c4645" />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No user data available</p>
                <p className="text-sm mt-2">Check console for API response details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Enrolled Courses */}
      <div className="bg-white border border-gray-100 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-bold mb-4 text-[#1c4645]">🏆 Top 5 Popular Courses</h2>
        {popularCourses && popularCourses.length > 0 ? (
          <div className="flex justify-center">
            <BarChart data={popularCourses} width={800} height={400} color="#22c55e" horizontal={true} />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No course data available</p>
              <p className="text-sm mt-2">Check console for API response details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
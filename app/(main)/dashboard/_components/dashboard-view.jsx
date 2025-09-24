"use client"

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, formatDistanceToNow } from 'date-fns';
import { BriefcaseBusiness,  LineChart,TrendingDown, TrendingUp, Zap, } from 'lucide-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DashboardView = ({insights}) => {
    const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));


    const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-amber-400";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

   const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

    const OutlookIcon = getMarketOutlookInfo(insights.marketOutLook).icon;
    const outlookColor = getMarketOutlookInfo(insights.marketOutLook).color;


    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    );
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market OutLook</CardTitle>
                <OutlookIcon className={`h-4 w-4 ${outlookColor}`}/>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{insights.marketOutLook}</div>
                <p className='text-xs text-muted-foreground'>
                    Next Update {nextUpdateDistance}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{insights.growthRate.toFixed(1)}%</div>
                <Progress value={insights.growthRate} className="mt-2" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                <BriefcaseBusiness className= "h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{insights.demandLevel}</div>
                <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`}></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                <Zap className= "h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className='flex flex-wrap gap-1'>{insights.topSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}</div>
            </CardContent>
        </Card>
        

        <Card className="col-span-4">
            <CardHeader >
                <CardTitle >Salary Ranges by Role</CardTitle>
                <CardDescription> Explore the salary spectrum: min, median & max (in thounsands)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='h-[400px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background border rounded-lg p-2 shadow-md">
                                        <p className="font-medium">{label}</p>
                                          {payload.map((item) => (
                                        <p key={item.name} className="text-sm">
                                          {item.name}: ${item.value}K
                                        </p>
                                      ))}
                                    </div>
                                );
                            }
                            return null;
                            }}
                        />
                        <Bar dataKey="min" fill="#a0f8ff" name="Min Salary (K)" radius={[4, 4, 0, 0]} />   // light purple
                        <Bar dataKey="median" fill="#33f3ff" name="Median Salary (K)" radius={[4, 4, 0, 0]} /> // medium purple
                        <Bar dataKey="max" fill="#00cfff" name="Max Salary (K)" radius={[4, 4, 0, 0]} />     // deep purple


                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 col-span-4'>
        <Card>
            <CardHeader>
                <CardTitle>Key Industry Trends</CardTitle>
                <CardDescription>Emerging Industry Trends & Innovations</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className='space-y-4'>
                    {insights.keyTrends.map((trend, index) => (
                        <li key={index} className='flex items-start space-x-2'>
                            <div className='h-2 w-2 mt-2 rounded-full bg-primary'/>
                            <span>{trend}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recommended Skills</CardTitle>
                <CardDescription>Skills shaping your future</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-wrap gap-2'>
                    {insights.recommendedSkills.map((skill) =>(
                        <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardView

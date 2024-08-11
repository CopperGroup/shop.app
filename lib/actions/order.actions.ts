"use server";

import Order from "../models/order.model";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import mongoose from 'mongoose';
import { revalidatePath } from "next/cache";
import moment from "moment";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

interface CreateOrderParams {
    products: {
        product: string,
        amount: number
    } [],
    userId: string;
    value: number;
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    paymentType: string;
    deliveryMethod: string;
    city: string;
    adress: string;
    postalCode: string;
    comment: string | undefined;
}

interface Product {
    id: string;
    productId: string; 
    priceToShow:number; 
    price:number; 
    name:string;
    imageUrl:string;
    description:string;
    url:string;
    likedBy: {
        _id: string;
        email: string;
    }[];
}

interface Order {
  _id: string;
  id: string,
  products: {
      product: string,
      amount: number
  } [];
  user: string;
  value: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  paymentType: string;
  deliveryMethod: string;
  city: string;
  adress: string;
  postalCode: string;
  comment: string | undefined;
  paymentStatus: string;
  deliveryStatus: string;
  data: Date;
}

interface TimePeriod {
    dateName: string;
    orders: Order[];
    totalValue: number;
    totalOrders: number;
}

function generateUniqueId() {
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a random 4-digit number
    const timestampPart = Date.now().toString().slice(-4); // Gets the last 4 digits of the current timestamp
    return randomPart + timestampPart; // Concatenate both parts to form an 8-digit ID
}

function generateRandomDateWithinYear() {
    const today = moment();
    const oneYearAgo = today.clone().subtract(1, 'years');

    // Get a random number of days between 0 and 365
    const randomDays = Math.floor(Math.random() * 366); // 365 days + 1 to include today

    // Add the random number of days to one year ago to get a random date within the past year
    return oneYearAgo.add(randomDays, 'days').toDate();
}

export async function createOrder({ products, userId, value, name, surname, phoneNumber, email, paymentType, deliveryMethod, city, adress, postalCode, comment }: CreateOrderParams) {
    try {
        connectToDB();

        const uniqueId = generateUniqueId();

        const createdOrder = await Order.create({
            id: uniqueId,
            products: products,
            user: userId,
            value: value,
            name: name,
            surname: surname,
            phoneNumber: phoneNumber,
            email: email,
            paymentType: paymentType,
            deliveryMethod: deliveryMethod,
            city: city,
            adress: adress,
            postalCode: postalCode,
            comment: comment ? comment : "",
            paymentStatus: "Pending",
            deliveryStatus: "Proceeding",
        })

        const user = await User.findById(userId);

        await User.findById(userId).updateOne({
          name: name,
          surname: surname,
          phoneNumber: phoneNumber,
        })

        user.orders.push({
          order: createdOrder._id,
          createdAt: Date.now()
        })

        user.totalOrders += 1;

        await user.save();

        for(const product of products) {
            const orderedProduct = await Product.findById(product.product);

            orderedProduct.quantity = orderedProduct.quantity - product.amount;

            await orderedProduct.save();
        }

    } catch (error: any) {
        throw new Error(`Error creating order: ${error.message}`)
    }
}

// export async function createOrder({ products, userId, value, name, surname, phoneNumber, email, paymentType, deliveryMethod, city, adress, postalCode, comment }: CreateOrderParams) {
//     try {
//         connectToDB();

//         const ordersToCreate = 10; // Number of orders to create

//         for (let i = 0; i < ordersToCreate; i++) {
//             const uniqueId = generateUniqueId();

//             // Generate a random date within the current year
//             const randomDateWithinYear = generateRandomDateWithinCurrentYear();

//             const createdOrder = await Order.create({
//                 id: uniqueId,
//                 products: products,
//                 user: userId,
//                 value: value,
//                 name: name,
//                 surname: surname,
//                 phoneNumber: phoneNumber,
//                 email: email,
//                 paymentType: paymentType,
//                 deliveryMethod: deliveryMethod,
//                 city: city,
//                 adress: adress,
//                 postalCode: postalCode,
//                 comment: comment ? comment : "",
//                 paymentStatus: "Success",
//                 deliveryStatus: "Fulfilled",
//                 date: randomDateWithinYear // Set the random date
//             });

//             for (const product of products) {
//                 const orderedProduct = await Product.findById(product.product);

//                 orderedProduct.quantity = orderedProduct.quantity - product.amount;

//                 await orderedProduct.save();
//             }
//         }
//     } catch (error: any) {
//         throw new Error(`Error creating order: ${error.message}`)
//     }
// }


export async function fetchOrders() {
    try {
        connectToDB();

        const orders = await Order.find()
            .sort({ data: "desc" })
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Product',
                    select: 'id images name priceToShow price'
                }
            })
            .populate({
                path: 'user',
                model: 'User',
                select: "_id email"
            })

        return orders;
    } catch (error: any) {
        throw new Error(`Error fetching ordeds: ${error.message}`)
    }
}


export async function fetchOrdersPayments() {
  try {
      connectToDB();

      const orders = await Order.find()
          .sort({ data: "desc" })      
      
      let payments = [];

      for(const payment of orders) {
        payments.push({
          id: payment.id,
          value: payment.value,
          name: payment.name + " " + payment.surname,
          phoneNumber: payment.phoneNumber,
          email: payment.email,
          paymentStatus: payment.paymentStatus,
          deliveryStatus: payment.deliveryStatus,
          date: payment.data 
        })
      }

      return payments;
  } catch (error: any) {
      throw new Error(`Error fetching ordeds: ${error.message}`)
  }
}

export async function fetchOrder(orderId: string) {
    try {
        connectToDB();

        const order = await Order.findOne({ id: orderId })
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Product',
                    select: 'id name images priceToShow params'
                }
            })
            .populate({
                path: 'user',
                model: 'User',
            });

        return order;
    } catch (error: any) {
        throw new Error(`Error fetching order: ${error.message}`)
    }
}




export async function fetchUsersOrders(email:string){
    try {

        const user = await User.findOne({email:email});

        const orders = await Order.find({ user: user._id})
        .sort({ data: "desc" })
        .populate({
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product',
                select: 'id name images priceToShow params'
            }
        })
        .populate({
            path: 'user',
            model: 'User',
        });


        return orders
    } catch (error:any) {
        throw new Error(`Error fetching user's orders: ${error.message}`)
    }
}

export async function delOrder(id:string){
    try {
        const objectId = new mongoose.Types.ObjectId(id);
        await Order.findByIdAndDelete(objectId);
    } catch (error:any) {
        throw new Error(`Error deleting order: ${error.message}`)
    }
}


export async function deleteOrder(id: string, path: string) {
    try {
        connectToDB();

        const order = await Order.deleteOne({ id: id });

        revalidatePath(path);
        revalidatePath("/myOrders");
        revalidatePath("/admin/orders");
    } catch (error: any) {
        throw new Error(`Error deleting order: ${error.message}`)
    }
}

export async function changePaymentStatus(id: string, status: string, path: string) {
    try {
        connectToDB();

        const order = await Order.findOne({ id: id });

        order.paymentStatus = status;

        order.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error changing order's payment status: ${error.message}`)
    }
}

export async function changedeliveryStatus(id: string, status: string, path: string) {
    try {
        connectToDB();

        const order = await Order.findOne({ id: id });

        order.deliveryStatus = status;

        order.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error changing order's delivery status: ${error.message}`)
    }
}

export async function fetchUsersOrdersById(userId: string) {
  try {
    connectToDB();

    const usersOrders = await Order.find({ user: userId })
      .sort({ data: "desc" })
      .populate({
        path: 'products',
        populate: {
          path: 'product',
          model: 'Product',
          select: 'id name images priceToShow params'
        }
      })
      .populate({
        path: 'user',
        model: 'User',
      });

    return usersOrders;
  } catch (error: any) {
    throw new Error(`Error fetching user's orders by id: ${error.message}`)
  }
}

export async function getDashboardData() {
    try {
        connectToDB();

        const orders = await Order.find({ paymentStatus: "Success", deliveryStatus: "Fulfilled" })
        
        const oneYearAgo = moment().subtract(1, "years").toDate();
        const filteredOrders = orders.filter(order => order.data >= oneYearAgo);

        const today = moment();
        const currentMonthStart = moment().startOf('month');
        const currentMonthEnd = moment().endOf('month');
        const yesterday = moment().subtract(1, "days");
        const lastWeek = moment().subtract(1, "weeks").startOf('isoWeek');
        const lastMonth = moment().subtract(1, "months").startOf('month');
        const previousMonthStart = moment().subtract(1, "months").startOf('month');
        const previousMonthEnd = moment().subtract(1, "months").endOf('month');
        const lastThreeMonthsStart = moment().subtract(3, "months").startOf('month');
        const lastSixMonthsStart = moment().subtract(6, "months").startOf('month');
        const lastYear = moment().subtract(1, "years").startOf('year');

        let dayTotalValue = 0;
        let weekTotalValue = 0;
        let monthTotalValue = 0;
        let threeMonthsTotalValue = 0;
        let sixMonthsTotalValue = 0;
        let yearTotalValue = 0;
        let totalValue = 0;

        let dayTotalOrders = 0;
        let weekTotalOrders = 0;
        let monthTotalOrders = 0;
        let threeMonthsTotalOrders = 0;
        let sixMonthsTotalOrders = 0;
        let yearTotalOrders = 0;
        let totalOrders = 0;

        let dayTotalProductsSold = 0;
        let weekTotalProductsSold = 0;
        let monthTotalProductsSold = 0;
        let threeMonthsTotalProductsSold = 0;
        let sixMonthsTotalProductsSold = 0;
        let yearTotalProductsSold = 0;
        let totalProductsSold = 0;

        let dayPopularProducts: { [productId: string]: number } = {};
        let weekPopularProducts: { [productId: string]: number } = {};
        let monthPopularProducts: { [productId: string]: number } = {};
        let threeMonthsPopularProducts: { [productId: string]: number } = {};
        let sixMonthsPopularProducts: { [productId: string]: number } = {};
        let yearPopularProducts: { [productId: string]: number } = {};
        let PopularProducts: { [productId: string]: number } = {};

        let previousDayTotalValue = 0;
        let previousWeekTotalValue = 0;
        let previousMonthTotalValue = 0;
        let previousThreeMonthsTotalValue = 0;
        let previousSixMonthsTotalValue = 0;
        let previousYearTotalValue = 0;

        let previousDayTotalOrders = 0;
        let previousWeekTotalOrders = 0;
        let previousMonthTotalOrders = 0;
        let previousThreeMonthsTotalOrders = 0;
        let previousSixMonthsTotalOrders = 0;
        let previousYearTotalOrders = 0;

        let previousDayTotalProductsSold = 0;
        let previousWeekTotalProductsSold = 0;
        let previousMonthTotalProductsSold = 0;
        let previousThreeMonthsTotalProductsSold = 0;
        let previousSixMonthsTotalProductsSold = 0;
        let previousYearTotalProductsSold = 0;

        let previousDayPopularProducts: { [productId: string]: number } = {};
        let previousWeekPopularProducts: { [productId: string]: number } = {};
        let previousMonthPopularProducts: { [productId: string]: number } = {};
        let previousThreeMonthsPopularProducts: { [productId: string]: number } = {};
        let previousSixMonthsPopularProducts: { [productId: string]: number } = {};
        let previousYearPopularProducts: { [productId: string]: number } = {};

        const day: TimePeriod[] = Array.from({ length: 24 }, (_, hour) => ({
            dateName: moment().hour(hour).format('HH:00'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
          }));

          const previousDay: TimePeriod[] = Array.from({ length: 24 }, (_, hour) => ({
            dateName: moment().subtract(1, "days").hour(hour).format('HH:00'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
        }));
      
          const startOfWeek = moment().startOf('isoWeek');
          const week: TimePeriod[] = Array.from({ length: 7 }, (_, day) => ({
            dateName: startOfWeek.clone().add(day, 'days').format('dddd D'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
          }));
      
          const startOfPreviousWeek = moment().subtract(1, "weeks").startOf('isoWeek');
            const previousWeek: TimePeriod[] = Array.from({ length: 7 }, (_, day) => ({
                dateName: startOfPreviousWeek.clone().add(day, 'days').format('dddd D'),
                orders: [] as Order[],
                totalValue: 0,
                totalOrders: 0
            }));


          const month: TimePeriod[] = Array.from({ length: moment().daysInMonth() }, (_, date) => ({
            dateName: moment().date(date + 1).format('D MMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
          }));

          const previousMonth: TimePeriod[] = Array.from({ length: lastMonth.daysInMonth() }, (_, date) => ({
            dateName: moment().subtract(1, "months").date(date + 1).format('D MMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
            }));
      
          const threeMonths: TimePeriod[] = Array.from({ length: 13 }, (_, week) => {
            const startOfWeek = moment().subtract(12 - week, 'weeks').startOf('isoWeek');
            const endOfWeek = moment().subtract(12 - week, 'weeks').endOf('isoWeek');
            return { dateName: `${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM')}`, orders: [] as Order[], totalValue: 0, totalOrders: 0};
          });

          const previousThreeMonths: TimePeriod[] = Array.from({ length: 13 }, (_, week) => {
            const startOfWeek = moment().subtract(25 - week, 'weeks').startOf('isoWeek');
            const endOfWeek = moment().subtract(25 - week, 'weeks').endOf('isoWeek');
            return { dateName: `${startOfWeek.format('D MMM')} - ${endOfWeek.format('D MMM')}`, orders: [] as Order[], totalValue: 0, totalOrders: 0 };
        });
      
          const sixMonths: TimePeriod[] = Array.from({ length: 6 }, (_, month) => ({
            dateName: moment().subtract(5 - month, 'months').format('MMMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
          }));
      
          const previousSixMonths: TimePeriod[] = Array.from({ length: 6 }, (_, month) => ({
            dateName: moment().subtract(11 - month, 'months').format('MMMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
        }));

          const year: TimePeriod[] = Array.from({ length: 12 }, (_, month) => ({
            dateName: moment().month(month).format('MMMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
          }));

          const previousYear: TimePeriod[] = Array.from({ length: 12 }, (_, month) => ({
            dateName: moment().subtract(1, 'years').month(month).format('MMMM'),
            orders: [] as Order[],
            totalValue: 0,
            totalOrders: 0
        }));
      
          const allTime: TimePeriod[] = [{ dateName: 'All Time', orders: filteredOrders, totalValue: 0, totalOrders: 0}];
      
          orders.forEach(order => {
            const orderDate = moment(order.data);

            const orderValue = order.value || 0;

            // Hour of the day
            if(orderDate.isSame(today, "day")) {
                day[orderDate.hour()].orders.push(order);
                day[orderDate.hour()].totalValue += orderValue;
                day[orderDate.hour()].totalOrders += 1;
                dayTotalValue += orderValue;
                dayTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    dayTotalProductsSold += product.amount,
                    dayPopularProducts[product.product] = (dayPopularProducts[product.product] || 0) + product.amount
                })
            }

            if(orderDate.isSame(yesterday, "day")) {
                previousDay[orderDate.hour()].orders.push(order);
                previousDay[orderDate.hour()].totalValue += orderValue;
                previousDay[orderDate.hour()].totalOrders += 1;
                previousDayTotalValue += orderValue;
                previousDayTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    previousDayTotalProductsSold += product.amount,
                    previousDayPopularProducts[product.product] = (previousDayPopularProducts[product.product] || 0) + product.amount
                })
            }
      
            // Day of the week
            if (orderDate.isSame(today, 'isoWeek')) {
                const weekDayIndex = orderDate.isoWeekday() - 1; // Monday is 0, Sunday is 6
                week[weekDayIndex].orders.push(order);
                week[weekDayIndex].totalValue += orderValue;
                week[weekDayIndex].totalOrders += 1;
                weekTotalValue += orderValue;
                weekTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    weekTotalProductsSold += product.amount,
                    weekPopularProducts[product.product] = (weekPopularProducts[product.product] || 0) + product.amount
                })
            }
            if (orderDate.isSame(lastWeek, 'isoWeek')) {
                const previousWeekDayIndex = orderDate.isoWeekday() - 1; // Monday is 0, Sunday is 6
                previousWeek[previousWeekDayIndex].orders.push(order);
                previousWeek[previousWeekDayIndex].totalValue += orderValue;
                previousWeek[previousWeekDayIndex].totalOrders += 1;
                previousWeekTotalValue += orderValue;
                previousWeekTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    previousWeekTotalProductsSold += product.amount;
                    previousWeekPopularProducts[product.product] = (previousWeekPopularProducts[product.product] || 0) + product.amount;
                });
            }

            // Day of the month
            const dayIndex = orderDate.date() - 1;
            if (dayIndex >= 0 && dayIndex < month.length && orderDate.isBetween(currentMonthStart, currentMonthEnd, 'day', '[]')) {
              month[dayIndex].orders.push(order);
              month[dayIndex].totalValue += orderValue;
              month[dayIndex].totalOrders += 1;
              monthTotalValue += orderValue;
              monthTotalOrders += 1;
              order.products.forEach((product: { product: string, amount: number; }) => {
                monthTotalProductsSold += product.amount,
                monthPopularProducts[product.product] = (monthPopularProducts[product.product] || 0) + product.amount
              });
            }
            

            const prevDayIndex = orderDate.date() - 1;
            if (prevDayIndex >= 0 && prevDayIndex < previousMonth.length && orderDate.isBetween(previousMonthStart, previousMonthEnd, 'day', '[]')) {
              previousMonth[prevDayIndex].orders.push(order);
              previousMonth[prevDayIndex].totalValue += orderValue;
              previousMonth[prevDayIndex].totalOrders += 1;
              previousMonthTotalValue += orderValue;
              previousMonthTotalOrders += 1;
              order.products.forEach((product: { product: string, amount: number; }) => {
                previousMonthTotalProductsSold += product.amount,
                previousMonthPopularProducts[product.product] = (previousMonthPopularProducts[product.product] || 0) + product.amount
              });
            }

              threeMonths.forEach((period, index) => {
                const [start, end] = period.dateName.split(' - ').map(dateStr => moment(dateStr, 'D MMM'));
                if (orderDate.isSameOrAfter(start) && orderDate.isBefore(end.clone().add(1, 'day'))) {
                  threeMonths[index].orders.push(order);
                  threeMonths[index].totalValue += orderValue;
                  threeMonths[index].totalOrders += 1;
                  threeMonthsTotalValue += orderValue;
                  threeMonthsTotalOrders += 1;
                  order.products.forEach((product: { product: string, amount: number; }) => {
                    threeMonthsTotalProductsSold += product.amount,
                    threeMonthsPopularProducts[product.product] = (threeMonthsPopularProducts[product.product] || 0) + product.amount
                  })
                }
              });
        
              previousThreeMonths.forEach((period, index) => {
                const [start, end] = period.dateName.split(' - ').map(dateStr => moment(dateStr, 'D MMM'));
                if (orderDate.isSameOrAfter(start) && orderDate.isBefore(end.clone().add(1, 'day'))) {
                    previousThreeMonths[index].orders.push(order);
                    previousThreeMonths[index].totalValue += orderValue;
                    previousThreeMonths[index].totalOrders += 1;
                    previousThreeMonthsTotalValue += orderValue;
                    previousThreeMonthsTotalOrders += 1;
                    order.products.forEach((product: { product: string, amount: number; }) => {
                        previousThreeMonthsTotalProductsSold += product.amount;
                        previousThreeMonthsPopularProducts[product.product] = (previousThreeMonthsPopularProducts[product.product] || 0) + product.amount;
                    });
                }
                });
              // Month of the six-month period
              const sixMonthsPeriods = sixMonths.map(period => {
                const start = moment(period.dateName, 'MMMM YYYY').startOf('month');
                const end = moment(period.dateName, 'MMMM YYYY').endOf('month');
                return { start, end };
              });
        
              sixMonthsPeriods.forEach((period, index) => {
                if (orderDate.isBetween(period.start, period.end, null, '[)')) {
                  sixMonths[index].orders.push(order);
                  sixMonths[index].totalValue += orderValue;
                  sixMonths[index].totalOrders += 1;
                  sixMonthsTotalValue += orderValue;
                  sixMonthsTotalOrders += 1;
                  order.products.forEach((product: { product: string, amount: number; }) => {
                    sixMonthsTotalProductsSold += product.amount,
                    sixMonthsPopularProducts[product.product] = (sixMonthsPopularProducts[product.product] || 0) + product.amount
                  })
                }
              });

              previousSixMonths.forEach((period, index) => {
                const start = moment().subtract(6 + 5 - index, 'months').startOf('month');
                const end = start.clone().endOf('month');
                if (orderDate.isSameOrAfter(start) && orderDate.isBefore(end.clone().add(1, 'day'))) {
                    previousSixMonths[index].orders.push(order);
                    previousSixMonths[index].totalValue += orderValue;
                    previousSixMonths[index].totalOrders += 1;
                    previousSixMonthsTotalValue += orderValue;
                    previousSixMonthsTotalOrders += 1;
                    order.products.forEach((product: { product: string, amount: number; }) => {
                        previousSixMonthsTotalProductsSold += product.amount;
                        previousSixMonthsPopularProducts[product.product] = (previousSixMonthsPopularProducts[product.product] || 0) + product.amount;
                    });
                }
            });
      
            // Month of the year
            if (orderDate.isSame(today, 'year')) {
                year[orderDate.month()].orders.push(order);
                year[orderDate.month()].totalValue += orderValue;
                year[orderDate.month()].totalOrders += 1;
                yearTotalValue += orderValue;
                yearTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    yearTotalProductsSold += product.amount,
                    yearPopularProducts[product.product] = (yearPopularProducts[product.product] || 0) + product.amount
                })
            }

            previousYear.forEach((period, index) => {
                const start = moment().subtract(1, 'years').month(index).startOf('month');
                const end = start.clone().endOf('month');
                if (orderDate.isSameOrAfter(start) && orderDate.isBefore(end.clone().add(1, 'day'))) {
                    previousYear[index].orders.push(order);
                    previousYear[index].totalValue += orderValue;
                    previousYear[index].totalOrders += 1;
                    previousYearTotalValue += orderValue;
                    previousYearTotalOrders += 1;
                    order.products.forEach((product: { product: string, amount: number; }) => {
                        previousYearTotalProductsSold += product.amount;
                        previousYearPopularProducts[product.product] = (previousYearPopularProducts[product.product] || 0) + product.amount;
                    });
                }
            });
          });

          
      
          const findMostPopularProductId = async (popularProducts: { [productId: string]: number }) => {
            let mostPopularProduct = { productId: '', count: 0};

            for(const productId in popularProducts) {
                if(popularProducts[productId] > mostPopularProduct.count) {
                    mostPopularProduct = { productId, count: popularProducts[productId] }
                }
            }

            const product = await Product.findById(mostPopularProduct.productId)

            return { name: product.name, id: product._id, searchParam: product.params[0].value, quantity: mostPopularProduct.count }
          }

          const findPercentageValue = (previousValue: number, currentValue: number) => {
            if(previousValue > 0) {
                return (((currentValue - previousValue) / previousValue) * 100)
            } else if (dayTotalValue > 0) {
                return 100
            } else {
                return 0
            }
          }
          
          const previousDayStats = {
              data: previousDay,
              totalValue: previousDayTotalValue,
              totalOrders: previousDayTotalOrders,
              totalProductsSold: previousDayTotalProductsSold,
              averageOrderValue: previousDayTotalOrders > 0 ? (previousDayTotalValue / previousDayTotalOrders) : 0,
            }
            
            const dayStats = {
              data: day,
              totalValue: dayTotalValue,
              totalOrders: dayTotalOrders,
              totalProductsSold: dayTotalProductsSold,
              averageOrderValue: dayTotalOrders > 0 ? (dayTotalValue / dayTotalOrders) : 0,
              mostPopularProduct: Object.keys(dayPopularProducts).length > 0
                ? await findMostPopularProductId(dayPopularProducts)
                : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousDayStats.totalValue, dayTotalValue),
                totalOrders: findPercentageValue(previousDayStats.totalOrders, dayTotalOrders),
                totalProductsSold: findPercentageValue(previousDayStats.totalProductsSold, dayTotalProductsSold),
                averageOrderValue: findPercentageValue(previousDayStats.averageOrderValue, dayTotalOrders > 0 ? (dayTotalValue / dayTotalOrders) : 0)
              },
              numericStats: {
                totalValue: dayTotalValue - previousDayStats.totalValue,
                totalOrders: dayTotalOrders - previousDayStats.totalOrders,
                totalProductsSold: dayTotalProductsSold - previousDayStats.totalProductsSold,
                averageOrderValue: (dayTotalOrders > 0 ? (dayTotalValue / dayTotalOrders) : 0) - previousDayStats.averageOrderValue
              }
            }
          
          const previousWeekStats = {
              data: previousWeek,
              totalValue: previousWeekTotalValue,
              totalOrders: previousWeekTotalOrders,
              totalProductsSold: previousWeekTotalProductsSold,
              averageOrderValue: previousWeekTotalOrders > 0 ? (previousWeekTotalValue / previousWeekTotalOrders) : 0,
            }
            
            const weekStats = {
              data: week,
              totalValue: weekTotalValue,
              totalOrders: weekTotalOrders,
              totalProductsSold: weekTotalProductsSold,
              averageOrderValue: weekTotalOrders > 0 ? (weekTotalValue / weekTotalOrders) : 0,
              mostPopularProduct: Object.keys(weekPopularProducts).length > 0
                ? await findMostPopularProductId(weekPopularProducts)
                : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousWeekStats.totalValue, weekTotalValue),
                totalOrders: findPercentageValue(previousWeekStats.totalOrders, weekTotalOrders),
                totalProductsSold: findPercentageValue(previousWeekStats.totalProductsSold, weekTotalProductsSold),
                averageOrderValue: findPercentageValue(previousWeekStats.averageOrderValue, weekTotalOrders > 0 ? (weekTotalValue / weekTotalOrders) : 0)
              },
              numericStats: {
                totalValue: weekTotalValue - previousWeekStats.totalValue,
                totalOrders: weekTotalOrders - previousWeekStats.totalOrders,
                totalProductsSold: weekTotalProductsSold - previousWeekStats.totalProductsSold,
                averageOrderValue: (weekTotalOrders > 0 ? (weekTotalValue / weekTotalOrders) : 0) - previousWeekStats.averageOrderValue
              }
            }
          
          const previousMonthStats = {
              data: previousMonth,
              totalValue: previousMonthTotalValue,
              totalOrders: previousMonthTotalOrders,
              totalProductsSold: previousMonthTotalProductsSold,
              averageOrderValue: previousMonthTotalOrders > 0 ? (previousMonthTotalValue / previousMonthTotalOrders) : 0,
            }
            
            const monthStats = {
              data: month,
              totalValue: monthTotalValue,
              totalOrders: monthTotalOrders,
              totalProductsSold: monthTotalProductsSold,
              averageOrderValue: monthTotalOrders > 0 ? (monthTotalValue / monthTotalOrders) : 0,
              mostPopularProduct: Object.keys(monthPopularProducts).length > 0
                ? await findMostPopularProductId(monthPopularProducts)
                : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousMonthStats.totalValue, monthTotalValue),
                totalOrders: findPercentageValue(previousMonthStats.totalOrders, monthTotalOrders),
                totalProductsSold: findPercentageValue(previousMonthStats.totalProductsSold, monthTotalProductsSold),
                averageOrderValue: findPercentageValue(previousMonthStats.averageOrderValue, monthTotalOrders > 0 ? (monthTotalValue / monthTotalOrders) : 0)
              },
              numericStats: {
                totalValue: monthTotalValue - previousMonthStats.totalValue,
                totalOrders: monthTotalOrders - previousMonthStats.totalOrders,
                totalProductsSold: monthTotalProductsSold - previousMonthStats.totalProductsSold,
                averageOrderValue: (monthTotalOrders > 0 ? (monthTotalValue / monthTotalOrders) : 0) - previousMonthStats.averageOrderValue
              }
            }
            
            const previousThreeMonthsStats = {
                data: previousThreeMonths,
                totalValue: previousThreeMonthsTotalValue,
                totalOrders: previousThreeMonthsTotalOrders,
                totalProductsSold: previousThreeMonthsTotalProductsSold,
                averageOrderValue: previousThreeMonthsTotalOrders > 0 ? (previousThreeMonthsTotalValue / previousThreeMonthsTotalOrders) : 0,
            }
            
            const threeMonthsStats = {
              data: threeMonths,
              totalValue: threeMonthsTotalValue,
              totalOrders: threeMonthsTotalOrders,
              totalProductsSold: threeMonthsTotalProductsSold,
              averageOrderValue: threeMonthsTotalOrders > 0 ? (threeMonthsTotalValue / threeMonthsTotalOrders) : 0,
              mostPopularProduct: Object.keys(sixMonthsPopularProducts).length > 0
                ? await findMostPopularProductId(sixMonthsPopularProducts)
                : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousThreeMonthsStats.totalValue, threeMonthsTotalValue),
                totalOrders: findPercentageValue(previousThreeMonthsStats.totalOrders, threeMonthsTotalOrders),
                totalProductsSold: findPercentageValue(previousThreeMonthsStats.totalProductsSold, threeMonthsTotalProductsSold),
                averageOrderValue: findPercentageValue(previousThreeMonthsStats.averageOrderValue, threeMonthsTotalOrders > 0 ? (threeMonthsTotalValue / threeMonthsTotalOrders) : 0)
              },
              numericStats: {
                totalValue: threeMonthsTotalValue - previousThreeMonthsStats.totalValue,
                totalOrders: threeMonthsTotalOrders - previousThreeMonthsStats.totalOrders,
                totalProductsSold: threeMonthsTotalProductsSold - previousThreeMonthsStats.totalProductsSold,
                averageOrderValue: (threeMonthsTotalOrders > 0 ? (threeMonthsTotalValue / threeMonthsTotalOrders) : 0) - previousThreeMonthsStats.averageOrderValue
              }
            }
          
          const previousSixMonthsStats = {
              data: previousSixMonths,
              totalValue: previousSixMonthsTotalValue,
              totalOrders: previousSixMonthsTotalOrders,
              totalProductsSold: previousSixMonthsTotalProductsSold,
              averageOrderValue: previousSixMonthsTotalOrders > 0 ? (previousSixMonthsTotalValue / previousSixMonthsTotalOrders) : 0,
            }
            
            const sixMonthsStats = {
              data: sixMonths,
              totalValue: sixMonthsTotalValue,
              totalOrders: sixMonthsTotalOrders,
              totalProductsSold: sixMonthsTotalProductsSold,
              averageOrderValue: sixMonthsTotalOrders > 0 ? (sixMonthsTotalValue / sixMonthsTotalOrders) : 0,
              mostPopularProduct: Object.keys(sixMonthsPopularProducts).length > 0
                ? await findMostPopularProductId(sixMonthsPopularProducts)
                : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousSixMonthsStats.totalValue, sixMonthsTotalValue),
                totalOrders: findPercentageValue(previousSixMonthsStats.totalOrders, sixMonthsTotalOrders),
                totalProductsSold: findPercentageValue(previousSixMonthsStats.totalProductsSold, sixMonthsTotalProductsSold),
                averageOrderValue: findPercentageValue(previousSixMonthsStats.averageOrderValue, sixMonthsTotalOrders > 0 ? (sixMonthsTotalValue / sixMonthsTotalOrders) : 0)
              }, 
              numericStats: {
                totalValue: sixMonthsTotalValue - previousSixMonthsStats.totalValue,
                totalOrders: sixMonthsTotalOrders - previousSixMonthsStats.totalOrders,
                totalProductsSold: sixMonthsTotalProductsSold - previousSixMonthsStats.totalProductsSold,
                averageOrderValue: (sixMonthsTotalOrders > 0 ? (sixMonthsTotalValue / sixMonthsTotalOrders) : 0) - previousSixMonthsStats.averageOrderValue
              }
            }
          
          const previousYearStats = {
              data: previousYear,
              totalValue: previousYearTotalValue,
              totalOrders: previousYearTotalOrders,
              totalProductsSold: previousYearTotalProductsSold,
              averageOrderValue: previousYearTotalOrders > 0 ? (previousYearTotalValue / previousYearTotalOrders) : 0,
            }
            
            const yearStats = {
              data: year,
              totalValue: yearTotalValue,
              totalOrders: yearTotalOrders,
              totalProductsSold: yearTotalProductsSold,
              averageOrderValue: yearTotalOrders > 0 ? (yearTotalValue / yearTotalOrders) : 0,
              mostPopularProduct: Object.keys(yearPopularProducts).length > 0
              ? await findMostPopularProductId(yearPopularProducts)
              : { name: "No products", id: "", searchParam: "", quantity: 0 },
              percentageStats: {
                totalValue: findPercentageValue(previousYearStats.totalValue, yearTotalValue),
                totalOrders: findPercentageValue(previousYearStats.totalOrders, yearTotalOrders),
                totalProductsSold: findPercentageValue(previousYearStats.totalProductsSold, yearTotalProductsSold),
                averageOrderValue: findPercentageValue(previousYearStats.averageOrderValue, yearTotalOrders > 0 ? (yearTotalValue / yearTotalOrders) : 0)
              },
              numericStats: {
                totalValue: yearTotalValue - previousYearStats.totalValue,
                totalOrders: yearTotalOrders - previousYearStats.totalOrders,
                totalProductsSold: yearTotalProductsSold - previousYearStats.totalProductsSold,
                averageOrderValue: (yearTotalOrders > 0 ? (yearTotalValue / yearTotalOrders) : 0) - previousYearStats.averageOrderValue
              }
            }

        return { dayStats, weekStats, monthStats, threeMonthsStats, sixMonthsStats, yearStats };

    } catch (error: any) {
        throw new Error(`Error getting dashboard data: ${error.message}`)
    }
}

function adjustToDivisionBy5(duration: number) {
  const lastDigit = duration % 10;

  let daysToSubtract = 0;

  switch (lastDigit) {
    case 0: 
    daysToSubtract = 0;
    break;

    case 1: 
    daysToSubtract = 1;
    break;

    case 2: 
    daysToSubtract = 2;
    break;

    case 3: 
    daysToSubtract = 3;
    break;

    case 4: 
    daysToSubtract = 4;
    break;

    case 5: 
    daysToSubtract = 0;
    break;

    case 6: 
    daysToSubtract = 1;
    break;

    case 7: 
    daysToSubtract = 2;
    break;

    case 8: 
    daysToSubtract = 3;
    break;

    case 9: 
    daysToSubtract = 4;
    break;

    default: 
      daysToSubtract = 0;
  }

  console.log(daysToSubtract);
  return daysToSubtract;
}

function adjustToDivisionBy6(duration: number) {
  let daysToSubtract = 0;
  let nearestPrevious = 0;

  const divisibleBy6Numbers = [150, 156, 162, 168, 174, 180];

  for(let i = 0; i < divisibleBy6Numbers.length; i++) {
    if(divisibleBy6Numbers[i] < duration) {
      nearestPrevious = divisibleBy6Numbers[i];
    } else {
      break
    }
  }

  if (nearestPrevious === 0) {
    return 0;
  }

  console.log("Nearest previous:", nearestPrevious);
  
  return duration - nearestPrevious;
}

function adjustToDivisionBy3(duration: number) {
  let daysToSubtract = 0;
  let nearestPrevious = 0;

  const divisibleBy6Numbers = [63, 66, 69, 72, 75, 78, 81, 84, 87];

  for(let i = 0; i < divisibleBy6Numbers.length; i++) {
    if(divisibleBy6Numbers[i] < duration) {
      nearestPrevious = divisibleBy6Numbers[i];
    } else {
      break
    }
  }

  if (nearestPrevious === 0) {
    return 0;
  }

  console.log("Nearest previous:", nearestPrevious);
  
  return duration - nearestPrevious;
}

function calculatePeriods(from: Date | undefined, to: Date | undefined) {
  if (!from) return [];

  const periods: { dateName: string }[] = [];

  if (to) {
    console.log(from, to);
    const startMoment = moment(from);
    const endMoment = moment(to);
    console.log(startMoment, endMoment);
    
    const startYear = startMoment.year();
    const startMonth = startMoment.month();
    const endYear = endMoment.year();
    const endMonth = endMoment.month();

    const monthsDuration = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    const durationInDays = endMoment.diff(startMoment, 'days') + 1;
    const durationInHours = endMoment.diff(startMoment, 'hours') + 24;

    console.log(durationInDays);
    console.log(durationInHours);
    console.log(monthsDuration);

    if (durationInDays > 5) {
      if (durationInDays <= 31) {
        // Return time period of subperiods = number of selected days
        for (let i = 0; i < durationInDays; i++) {
          const start = startMoment.clone().add(i, 'days');
          periods.push({ dateName: start.format('YYYY-MM-DD') });
        }

        //Should return a dateName of a single time (Already correct)
      } else {
        if (durationInDays <= 91) {
          if (durationInDays % 2 === 0 && durationInDays / 2 <= 31) {
            // Return the time period of the length of division result, subperiods consist of two days
            for (let i = 0; i < durationInDays; i += 2) {
              const start = startMoment.clone().add(i, 'days');
              const end = start.clone().add(1, 'days');
              periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
            }
            //Should return a range of time
          } else if (durationInDays % 3 === 0) {
            // Return the time period of the length of division result, subperiods consist of three days
            for (let i = 0; i < durationInDays; i += 3) {
              const start = startMoment.clone().add(i, 'days');
              const end = start.clone().add(2, 'days');
              periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
            }
            //Should return a range of time
          } else {

            if(durationInDays >= 63 && durationInDays <= 89) {
              const daysToSubtract = adjustToDivisionBy3(durationInDays);

              const adjustedDurationInDays = durationInDays - daysToSubtract;

              for(let i = 0; i < adjustedDurationInDays; i += 3) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(2, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format(`YYYY-MM-DD`)}`});
              }

              const lastPeriodStart = endMoment.clone().subtract(daysToSubtract - 1, 'days');

              if(daysToSubtract === 1) {
                periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)}` })
              } else {
                periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)} - ${endMoment.format('YYYY-MM-DD')}` });
              }
            } else {
              const adjustedDurationInDays = durationInDays - 1;
            
              if (adjustedDurationInDays % 2 === 0 && adjustedDurationInDays / 2 <= 30) {
                // Return the time period of the length of division result, subperiods consist of two days
                for (let i = 0; i < adjustedDurationInDays; i += 2) {
                  const start = startMoment.clone().add(i, 'days');
                  const end = start.clone().add(1, 'days');
                  periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                  
                }
                
                periods.push({ dateName: endMoment.format('YYYY-MM-DD') });          
              } else {
                // Return the time period of the length of division result, subperiods consist of three days
                for (let i = 0; i < adjustedDurationInDays; i += 3) {
                  const start = startMoment.clone().add(i, 'days');
                  const end = start.clone().add(2, 'days');
                  periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                }
              }
            }
          
            // Add the last day as a single period
          }
        } else {
          if (durationInDays <= 182) {
            if (durationInDays % 4 === 0 && durationInDays / 4 <= 31) {
              // Return the time period of the length of division result, subperiods consist of 4 days
              for (let i = 0; i < durationInDays; i += 4) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(3, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                //Should return a range of time
              }
            } else if (durationInDays % 5 === 0 && durationInDays / 5 <= 31) {
              // Return the time period of the length of division result, subperiods consist of 5 days
              for (let i = 0; i < durationInDays; i += 5) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(4, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
              }
              //Should return a range of time
            } else if (durationInDays % 6 === 0) {
              // Return the time period of the length of division result, subperiods consist of 6 days
              for (let i = 0; i < durationInDays; i += 6) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(5, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
              }
              //Should return a range of time
            } else if (durationInDays % 7 === 0) {
              // Return the time period of the length of division result, subperiods consist of 7 days
              for (let i = 0; i < durationInDays; i += 7) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(6, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
              }
              //Should return a range of time
            } else if (durationInDays % 10 === 0) {
              // Return the time period of the length of division result, subperiods consist of 7 days
              for (let i = 0; i < durationInDays; i += 10) {
                const start = startMoment.clone().add(i, 'days');
                const end = start.clone().add(9, 'days');
                periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
              }
            } else {
              console.log("Else");

              if(durationInDays <= 154) {
                const daysToSubtract = adjustToDivisionBy5(durationInDays);

                const adjustedDurationInDays = durationInDays - daysToSubtract;

                for(let i = 0; i < adjustedDurationInDays; i += 5) {
                  const start = startMoment.clone().add(i, 'days');
                  const end = start.clone().add(4, 'days');
                  periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format(`YYYY-MM-DD`)}`});
                }

                const lastPeriodStart = endMoment.clone().subtract(daysToSubtract - 1, 'days');

                if(daysToSubtract === 1) {
                  periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)}` })
                } else {
                  periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)} - ${endMoment.format('YYYY-MM-DD')}` });
                }
              } else if(durationInDays > 155) {
                const daysToSubtract = adjustToDivisionBy6(durationInDays);

                
                const adjustedDurationInDays = durationInDays - daysToSubtract;

                for(let i = 0; i < adjustedDurationInDays; i += 6) {
                  const start = startMoment.clone().add(i, 'days');
                  const end = start.clone().add(5, 'days');
                  periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format(`YYYY-MM-DD`)}`});
                }

                const lastPeriodStart = endMoment.clone().subtract(daysToSubtract - 1, 'days');

                if(daysToSubtract === 1) {
                  periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)}` })
                } else {
                  periods.push({ dateName: `${lastPeriodStart.format(`YYYY-MM-DD`)} - ${endMoment.format('YYYY-MM-DD')}` });
                }
              } else {
                console.log("Else 2");
                const adjustedDurationInDays = durationInDays - 3;
                
                if (adjustedDurationInDays % 4 === 0 && adjustedDurationInDays / 4 <= 30) {
                  // Return the time period of the length of division result, subperiods consist of four days
                  for (let i = 0; i < adjustedDurationInDays; i += 4) {
                    const start = startMoment.clone().add(i, 'days');
                    const end = start.clone().add(3, 'days');
                    periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                  }
                  
                } else if (adjustedDurationInDays % 5 === 0 && adjustedDurationInDays / 5 <= 30) {
                  // Return the time period of the length of division result, subperiods consist of five days
                  for (let i = 0; i < adjustedDurationInDays; i += 5) {
                    const start = startMoment.clone().add(i, 'days');
                    const end = start.clone().add(4, 'days');
                    periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                  }
                } else if (adjustedDurationInDays % 6 === 0) {
                  // Return the time period of the length of division result, subperiods consist of six days
                  for (let i = 0; i < adjustedDurationInDays; i += 6) {
                    const start = startMoment.clone().add(i, 'days');
                    const end = start.clone().add(5, 'days');
                    periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                  }
                } else if (adjustedDurationInDays % 7 === 0) {
                  // Return the time period of the length of division result, subperiods consist of seven days
                  for (let i = 0; i < adjustedDurationInDays; i += 7) {
                    const start = startMoment.clone().add(i, 'days');
                    const end = start.clone().add(6, 'days');
                    periods.push({ dateName: `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}` });
                  }
                }
            
                // Add the last three days as a single period
                const lastPeriodStart = endMoment.clone().subtract(3, 'days');
                periods.push({ dateName: `${lastPeriodStart.format('YYYY-MM-DD')} - ${endMoment.format('YYYY-MM-DD')}` });
              }
            }
          } else {
            if (monthsDuration <= 31) {
              // Return the time period of the length of division result, number of subperiods equals to the amount of months
              for (let i = 0; i < monthsDuration; i++) {
                const start = startMoment.clone().add(i, 'months');
                periods.push({ dateName: start.format('YYYY-MM') });
              }
              //Should return a dateName of a single time (Already correct)
            } else {
              if (monthsDuration <= 72) {
                if (monthsDuration % 2 === 0 && monthsDuration / 2 <= 31) {
                  // Return the time period of the length of division result, subperiods consist of two months
                  for (let i = 0; i < monthsDuration; i += 2) {
                    const start = startMoment.clone().add(i, 'months');
                    const end = start.clone().add(1, 'months');
                    periods.push({ dateName: `${start.format('YYYY-MM')} - ${end.format('YYYY-MM')}` });
                  }
                  //Should return a range of time
                } else if (monthsDuration % 3 === 0) {
                  // Return the time period of the length of division result, subperiods consist of three months
                  for (let i = 0; i < monthsDuration; i += 3) {
                    const start = startMoment.clone().add(i, 'months');
                    const end = start.clone().add(2, 'months');
                    periods.push({ dateName: `${start.format('YYYY-MM')} - ${end.format('YYYY-MM')}` });
                  }
                  //Should return a range of time
                } else {
                  // Try to separate the end period, if the results can be divided by 2 or 3 then go through previous algorithms starting at month's division section
                  for (let i = 0; i < monthsDuration - 1; i += 2) {
                    const start = startMoment.clone().add(i, 'months');
                    const end = start.clone().add(1, 'months');
                    periods.push({ dateName: `${start.format('YYYY-MM')} - ${end.format('YYYY-MM')}` });
                  }
                  periods.push({ dateName: endMoment.format('YYYY-MM') });
                  //Should return a range of time, the last one should be the end month and be a single time
                }
              } else {
                // Return the time period of the length of division result, the number of subperiods equals to the amount of years
                const yearsDuration = Math.ceil((monthsDuration)/ 12);
                for (let i = 0; i < yearsDuration; i++) {
                  const start = startMoment.clone().add(i, 'years');
                  periods.push({ dateName: start.format('YYYY') });
                }
                //Should return a dateName of a single time (Already correct)
              }
            }
          }
        }
      }
    } else {
      if (durationInHours % 2 === 0 && durationInHours / 2 <= 31) {
        // Return the time period of the length of division result, subperiods consist of 2 hours
        for (let i = 0; i < durationInHours; i += 2) {
          const start = startMoment.clone().add(i, 'hours');
          const end = start.clone().add(1, 'hours');
          periods.push({ dateName: `${start.format('YYYY-MM-DD HH:00')} - ${end.format('YYYY-MM-DD HH:00')}` });
        }
        //Should return a range of time
      } else if (durationInHours % 3 === 0 && durationInHours / 3 <= 31) {
        // Return the time period of the length of division result, subperiods consist of 3 hours
        for (let i = 0; i < durationInHours; i += 3) {
          const start = startMoment.clone().add(i, 'hours');
          const end = start.clone().add(2, 'hours');
          periods.push({ dateName: `${start.format('YYYY-MM-DD HH:00')} - ${end.format('YYYY-MM-DD HH:00')}` });
        }
        //Should return a range of time
      } else if (durationInHours % 4 === 0) {
        // Return the time period of the length of division result, subperiods consist of 4 hours
        for (let i = 0; i < durationInHours; i += 4) {
          const start = startMoment.clone().add(i, 'hours');
          const end = start.clone().add(3, 'hours');
          periods.push({ dateName: `${start.format('YYYY-MM-DD HH:00')} - ${end.format('YYYY-MM-DD HH:00')}` });
        }
        //Should return a range of time
      } else {
        // Try to separate the end period, if the results can be divided by 2 or 3 then go through previous algorithms starting at division section
        for (let i = 0; i < durationInHours - 1; i += 2) {
          const start = startMoment.clone().add(i, 'hours');
          const end = start.clone().add(1, 'hours');
          periods.push({ dateName: `${start.format('YYYY-MM-DD HH:00')} - ${end.format('YYYY-MM-DD HH:00')}` });
        }
        periods.push({ dateName: endMoment.format('YYYY-MM-DD HH:00') });
        //Should return a range of time, the last one should be the end hour and be a single time
      }
    }
  } else {
    // The number of subperiods = 24 
    for (let hour = 0; hour < 24; hour++) {
      const start = moment(from).startOf('day').add(hour, 'hours');
      periods.push({ dateName: start.format('YYYY-MM-DD HH:00') });
      //Should return a dateName of a single time (Already correct)
    }
  }

  console.log(periods.length);
  return periods;
}

function determineDateFormat(dateString: string) {
  if(/^\d{4}-\d{2}-\d{2} \d{2}:00$/.test(dateString)) {

    return 'YYYY-MM-DD HH:00';
  } else if(/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

    return 'YYYY-MM-DD';
  } else if(/^\d{4}-\d{2}$/.test(dateString)) {

    return 'YYYY-MM';
  } else if(/^\d{4}$/.test(dateString)) {

    return 'YYYY';
  }
}

function reformat(transformedData: { dateName: string, value: any }[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  function getDaySuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }


  return transformedData.map((item, index, array) => {
    const [startDate, endDate] = item.dateName.split(" - ");

    const format = determineDateFormat(startDate);

    if(format === "YYYY-MM-DD"){
      if (!item.dateName.includes(" - ")) {
        // Single date
        const [year, month, day] = item.dateName.split("-");
        let formattedDate = `${months[parseInt(month) - 1]} ${parseInt(day)}`;
  
        if(index === 0 || index === array.length - 1) {
          formattedDate = `${year} ${formattedDate}`;
        } 
  
        return {
          dateName: `${formattedDate}`,
          value: item.value
        };
      } else {
        // Date range
  
        const [startYear, startMonth, startDay] = startDate.split("-");
        const [endYear, endMonth, endDay] = endDate.split("-");
  
        let formattedStartDate = `${months[parseInt(startMonth) - 1]} ${parseInt(startDay)}`;
        let formattedEndDate = `${months[parseInt(endMonth) - 1]} ${parseInt(endDay)}`;
  
        if (index === 0) {
          formattedStartDate = `${startYear} ${formattedStartDate}`;
        }
  
        if (index === array.length - 1) {
          formattedEndDate = `${endYear} ${formattedEndDate}`;
        }
  
        return {
          dateName: `${formattedStartDate} - ${formattedEndDate}`,
          value: item.value
        };
      }
    } else if(format === "YYYY-MM-DD HH:00") {
      if (!item.dateName.includes(" - ")) {
        // Single date
        const [date, time] = item.dateName.split(" ");
        const [year, month, day] = date.split("-").map(Number);

        const dateObject = new Date(year, month - 1, day);
        const dayOfWeek = daysOfWeek[dateObject.getDay()];
        const dayWithSuffix = `${day}${getDaySuffix(day)}`; 
  
        return {
          dateName: `${time}`,
          value: item.value
        };
      } else {
        const [startDateDay, startTime] = startDate.split(" ");
        const [startYear, startMonth, startDay] = startDateDay.split("-").map(Number);

        const startDateObject = new Date(startYear, startMonth - 1, startDay);
        const startDayOfWeek = daysOfWeek[startDateObject.getDay()];

        const [endDateDay, endTime] = endDate.split(" ");
        const [endYear, endMonth, endDay] = endDateDay.split("-").map(Number);

        const endDateObject = new Date(endYear, endMonth - 1, endDay);
        const endDayOfWeek = daysOfWeek[endDateObject.getDay()];

        return {
          dateName: `${startDayOfWeek} ${startTime} - ${endTime}`,
          value: item.value
        }
      }
    } else if(format === "YYYY-MM") {
      if (!item.dateName.includes(" - ")) {
        // Single date
        const [year, month, day] = item.dateName.split("-");
        let formattedDate = `${year} ${months[parseInt(month) - 1]}`;
        return {
          dateName: `${formattedDate}`,
          value: item.value
        };
      } else {
        // Date range
  
        const [startYear, startMonth, startDay] = startDate.split("-");
        const [endYear, endMonth, endDay] = endDate.split("-");
  
        let formattedStartDate = `${startYear} ${months[parseInt(startMonth) - 1]}`;
        let formattedEndDate = `${endYear} ${months[parseInt(endMonth) - 1]}`;
  
        return {
          dateName: `${formattedStartDate} - ${formattedEndDate}`,
          value: item.value
        };
      }
    } else {
      return {
        dateName: item.dateName,
        value: item.value
      }
    }
  });
}

function groupOrdersByPeriods(orders: Order[], periods: { dateName: string}[]) {
  const data: { [key: string]: Order[]} = {};

  periods.forEach(period => {
    const periodKey = period.dateName;
    data[periodKey] = []; // Initialize period key here
  });

  orders.forEach(order => {
    const orderDate = moment(order.data);

    periods.forEach(period => {
      const periodKey = period.dateName;

      if(periodKey.includes(` - `)) {
        const [start, end] = periodKey.split(' - ');
  
        // console.log("Start:", start);
  
        const format = determineDateFormat(start);

        const startDate = moment(start, format);
        let endDate = moment(end, format);

        console.log("Start date", startDate);

        if(format === 'YYYY-MM-DD HH:00') {
          endDate = endDate.endOf('hour');
        } else if(format === 'YYYY-MM-DD') {
          endDate = endDate.endOf('day');
        } else if(format === 'YYYY-MM') {
          endDate = endDate.endOf('month');
        } else if(format === 'YYYY') {
          endDate = endDate.endOf('year');
        }
  
        if(orderDate.isBetween(startDate, endDate, undefined, '[]')) {
          data[periodKey].push(order)
        }
      } else {
        const format = determineDateFormat(periodKey);
  
        // console.log(format);

        const date = moment(periodKey, format);

        console.log("Start date", date);
        // console.log(orderDate, date, orderDate.isSame(date, 'day'));
        if (
          (format === 'YYYY-MM-DD HH:00' && orderDate.isSame(date, 'hour')) ||
          (format === 'YYYY-MM-DD' && orderDate.isSame(date, 'day')) ||
          (format === 'YYYY-MM' && orderDate.isSame(date, 'month')) ||
          (format === 'YYYY' && orderDate.isSame(date, 'year'))
        ) {
          data[periodKey].push(order);
        }
        // console.log(periodKey);
  
        // console.log('Format:', format)
      }
    });
  })

  // console.log(data);

  return data;
}

export async function findAverageOrderValue(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const averageData: { [key: string]: number} = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const totalValue = ordersInPeriod.reduce((sum, order) => sum + order.value, 0);

        const averageValue = totalValue !== 0 ? totalValue / ordersInPeriod.length : 0;

        averageData[period] = averageValue;
      } else {
        averageData[period] = 0;
      }
    }

    console.log(averageData);
    const transformedData = Object.entries(averageData).map(([dateName, averageValue]) => ({
      dateName,
      value: averageValue
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding average order value: ${error.message}`)
  }
}

export async function findTotalOrders(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const totalOrders: { [key: string]: number} = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      totalOrders[period] = ordersInPeriod.length;
    }

    console.log(totalOrders);

    const transformedData = Object.entries(totalOrders).map(([dateName, orders]) => ({
      dateName,
      value: orders
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding total orders: ${error.message}`)
  }
}

export async function findTotalRevenue(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const totalRevenue: { [key: string]: number} = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const totalValue = ordersInPeriod.reduce((sum, order) => sum + order.value, 0);

        totalRevenue[period] = totalValue;
      } else {
        totalRevenue[period] = 0;
      }
    }

    console.log(totalRevenue);

    const transformedData = Object.entries(totalRevenue).map(([dateName, revenue]) => ({
      dateName,
      value: revenue
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding total revenue: ${error.message}`)
  }
}

export async function findTopSellingProduct(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const topSellingProduct: { [key: string]: { product: {name: string, image: string, searchParam: string | null}, amount: number } } = {};

    let totalTopSellingProduct: { [key: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const productSales: { [key: string ]: number } = {};

        ordersInPeriod.forEach(order => {
          order.products.forEach(product => {
            if(!productSales[product.product]) {
              productSales[product.product] = 0;
              totalTopSellingProduct[product.product] = 0;
            }

            productSales[product.product] += product.amount;
            totalTopSellingProduct[product.product] += product.amount;
          })
        })

        let topProduct = '';
        let maxAmount = 0;

        for(const product in productSales) {
          if(productSales[product] > maxAmount) {
            topProduct = product;
            maxAmount = productSales[product];
          }
        }

        const topProductInfo = await Product.findById(topProduct);


        topSellingProduct[period] = { product: { name: topProductInfo.name, image: topProductInfo.images[0], searchParam: topProductInfo.params[0].value }, amount: maxAmount };
      } else {
        topSellingProduct[period] = { product: { name: 'No sales', image: "", searchParam: null}, amount: 0 };
      }
    }

    let totalTopProduct = '';
    let totalMaxAmount = 0

    for(const product in totalTopSellingProduct) {
      if(totalTopSellingProduct[product] > totalMaxAmount) {
        totalTopProduct = product;
        totalMaxAmount = totalTopSellingProduct[product];
      }
    }

    let totalTopSellingProductInfo = {
      name: "No sales",
      images: [""],
      params: [{ value: null }],
    }

    if(totalTopProduct !== '') {
      totalTopSellingProductInfo = await Product.findById(totalTopProduct) as any;
    }

    console.log(topSellingProduct);

    const transformedData = Object.entries(topSellingProduct).map(([dateName, product]) => ({
      dateName,
      value: product
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return { data: reformatedData, topProduct: { name: totalTopSellingProductInfo.name, image: totalTopSellingProductInfo.images[0], searchParam: totalTopSellingProductInfo.params[0].value, amount: totalMaxAmount } };
  } catch (error: any) {
    throw new Error(`Error finding top-selling product: ${error.message}`)
  }
}

export async function findLeastSellingProduct(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const leastSellingProducts: { [key: string]: { product: string, amount: number } } = {};

    const totalProductSales: { [key: string]: number } = {};

    let totalLowProduct = "";
    let totalMinAmount = Infinity;

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const productSales: { [key: string ]: number } = {};

        ordersInPeriod.forEach(order => {
          order.products.forEach(product => {
            if(!productSales[product.product]) {
              productSales[product.product] = 0;
              totalProductSales[product.product] = 0;
            }

            productSales[product.product] += product.amount;
            totalProductSales[product.product] += product.amount;
          })
        })

        let lowProduct = '';
        let minAmount = Infinity;

        for(const product in productSales) {
          if(productSales[product] < minAmount) {
            lowProduct = product;
            minAmount = productSales[product];
          }
        }

        leastSellingProducts[period] = { product: lowProduct, amount: minAmount };
      } else {
        leastSellingProducts[period] = { product: '', amount: Infinity};
      }
    }

    for(const product in totalProductSales) {
      if(totalProductSales[product] < totalMinAmount) {
        totalLowProduct = product;
        totalMinAmount = totalProductSales[product];
      }
    }

    console.log(totalLowProduct);

    console.log(leastSellingProducts);

    const transformedData = Object.entries(leastSellingProducts).map(([dateName, product]) => ({
      dateName,
      value: product,
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return {data: reformatedData, totalLowProduct};
  } catch (error: any) {
    throw new Error(`Error finding least selling product: ${error.message}`)
  }
}

export async function findSalesByCategory(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      }).populate({
        path: "products.product"
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const salesByCategory: { [key: string]: { category: string, sales: number }[] } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const categorySales: { [category: string]: number } = {};

        ordersInPeriod.forEach(order => {
          order.products.forEach(product => {
            console.log(product)
          })
        })
      } else {
      }
    }

    console.log(salesByCategory);

    return salesByCategory;
  } catch (error: any) {
    throw new Error(`Error finding sales by category: ${error.message}`)
  }
}

export async function findMostPopularRegion(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        }
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const postalCodeToRegion: { [key: string]: string } = {
      '01': 'Kyiv',
      '02': 'Kyiv Oblast',
      '04': 'Kyiv',
      '08': 'Kyiv Oblast',
      '09': 'Kyiv Oblast',
      '10': 'Zhytomyr Oblast',
      '11': 'Zhytomyr Oblast',
      '12': 'Zhytomyr Oblast',
      '13': 'Zhytomyr Oblast',
      '14': 'Chernihiv Oblast',
      '15': 'Chernihiv Oblast',
      '16': 'Chernihiv Oblast',
      '17': 'Chernihiv Oblast',
      '18': 'Cherkasy Oblast',
      '19': 'Cherkasy Oblast',
      '20': 'Cherkasy Oblast',
      '21': 'Vinnytsia Oblast',
      '22': 'Vinnytsia Oblast',
      '23': 'Vinnytsia Oblast',
      '24': 'Vinnytsia Oblast',
      '25': 'Kirovohrad Oblast',
      '26': 'Kirovohrad Oblast',
      '27': 'Kirovohrad Oblast',
      '28': 'Kirovohrad Oblast',
      '29': 'Khmelnytskyi Oblast',
      '30': 'Khmelnytskyi Oblast',
      '31': 'Khmelnytskyi Oblast',
      '32': 'Khmelnytskyi Oblast',
      '33': 'Rivne Oblast',
      '34': 'Rivne Oblast',
      '35': 'Rivne Oblast',
      '36': 'Poltava Oblast',
      '37': 'Poltava Oblast',
      '38': 'Poltava Oblast',
      '39': 'Poltava Oblast',
      '40': 'Sumy Oblast',
      '41': 'Sumy Oblast',
      '42': 'Sumy Oblast',
      '43': 'Volyn Oblast',
      '44': 'Volyn Oblast',
      '45': 'Volyn Oblast',
      '46': 'Ternopil Oblast',
      '47': 'Ternopil Oblast',
      '48': 'Ternopil Oblast',
      '49': 'Dnipropetrovsk Oblast',
      '50': 'Dnipropetrovsk Oblast',
      '51': 'Dnipropetrovsk Oblast',
      '52': 'Dnipropetrovsk Oblast',
      '53': 'Dnipropetrovsk Oblast',
      '54': 'Mykolaiv Oblast',
      '55': 'Mykolaiv Oblast',
      '56': 'Mykolaiv Oblast',
      '57': 'Mykolaiv Oblast',
      '58': 'Chernivtsi Oblast',
      '59': 'Chernivtsi Oblast',
      '60': 'Chernivtsi Oblast',
      '61': 'Kharkiv Oblast',
      '62': 'Kharkiv Oblast',
      '63': 'Kharkiv Oblast',
      '64': 'Kharkiv Oblast',
      '65': 'Odesa Oblast',
      '66': 'Odesa Oblast',
      '67': 'Odesa Oblast',
      '68': 'Odesa Oblast',
      '69': 'Zaporizhzhia Oblast',
      '70': 'Zaporizhzhia Oblast',
      '71': 'Zaporizhzhia Oblast',
      '72': 'Zaporizhzhia Oblast',
      '73': 'Kherson Oblast',
      '74': 'Kherson Oblast',
      '75': 'Kherson Oblast',
      '76': 'Ivano-Frankivsk Oblast',
      '77': 'Ivano-Frankivsk Oblast',
      '78': 'Ivano-Frankivsk Oblast',
      '79': 'Lviv Oblast',
      '80': 'Lviv Oblast',
      '81': 'Lviv Oblast',
      '82': 'Lviv Oblast',
      '83': 'Donetsk Oblast',
      '84': 'Donetsk Oblast',
      '85': 'Donetsk Oblast',
      '86': 'Donetsk Oblast',
      '87': 'Donetsk Oblast',
      '88': 'Zakarpattia Oblast',
      '89': 'Zakarpattia Oblast',
      '90': 'Zakarpattia Oblast',
      '91': 'Luhansk Oblast',
      '92': 'Luhansk Oblast',
      '93': 'Luhansk Oblast',
      '94': 'Luhansk Oblast',
      '95': 'Crimea',
      '96': 'Crimea',
      '97': 'Crimea',
      '98': 'Crimea'
    };

    const regionOrders: { [key: string]: { region: string, number: number } } = {};

    const totalMostPopularRegion: { [region: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      if(ordersInPeriod.length > 0) {
        const regionSales: { [region: string]: number } = {};

        ordersInPeriod.forEach(order => {
          const postalCode = order.postalCode.substring(0, 2);
          const region = postalCodeToRegion[postalCode] || "Else";

          if(!regionSales[region]) {
            regionSales[region] = 0;
            totalMostPopularRegion[region] = totalMostPopularRegion[region] || 0;
          }

          regionSales[region] += 1;
          totalMostPopularRegion[region] += 1
        })

        const mostPopularRegion = Object.keys(regionSales).reduce((current, previous) => regionSales[current] > regionSales[previous] ? current : previous);

        regionOrders[period] = {
          region: mostPopularRegion,
          number: regionSales[mostPopularRegion]
        }

      } else {
        regionOrders[period] = {
          region: "None",
          number: 0
        }
      }
    }

    const mostPopularRegionOverall = Object.keys(totalMostPopularRegion).reduce(
      (current, previous) => totalMostPopularRegion[current] > totalMostPopularRegion[previous] ? current : previous,
      Object.keys(totalMostPopularRegion)[0] || "None"
    );
  
    console.log(`Most popular region overall: ${mostPopularRegionOverall}`);

    console.log(regionOrders);

    const transformedData = Object.entries(regionOrders).map(([dateName, orders]) => ({
      dateName,
      value: {
        region: orders.region,
        number: orders.number
      }
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return {data: reformatedData, topRegion: mostPopularRegionOverall};
  } catch (error: any) {
    throw new Error(`Error finding most popular region: : ${error.message}`)
  }
}

export async function findSuccessfulOrders(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        },
        paymentStatus: "Success",
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        paymentStatus: "Success"
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const successfulOrders: { [key: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      successfulOrders[period] = ordersInPeriod.length;
    }

    console.log(successfulOrders);

    const transformedData = Object.entries(successfulOrders).map(([dateName, orders]) => ({
      dateName,
      value: orders
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding successful orders: ${error.message}`)
  }
}


export async function findDeclinedOrders(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        },
        paymentStatus: "Declined",
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        paymentStatus: "Declined"
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const declinedOrders: { [key: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      declinedOrders[period] = ordersInPeriod.length;
    }

    console.log(declinedOrders);

    const transformedData = Object.entries(declinedOrders).map(([dateName, orders]) => ({
      dateName,
      value: orders
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding declined orders: ${error.message}`)
  }
}

export async function findFulfilledOrders(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        },
        deliveryStatus: "Fulfilled",
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        deliveryStatus: "Fulfilled"
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const fulfilledOrders: { [key: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      fulfilledOrders[period] = ordersInPeriod.length;
    }

    console.log(fulfilledOrders);

    const transformedData = Object.entries(fulfilledOrders).map(([dateName, orders]) => ({
      dateName,
      value: orders
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding fulfilled orders: ${error.message}`)
  }
}

export async function findCanceledOrders(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    
    let orders = [];


    if(from && to) {
      const startDay = new Date(from);
      // startDay.setDate(startDay.getDate() + 1);

      console.log(startDay);

      const endDay = new Date(to);
      endDay.setDate(endDay.getDate() + 1);

      console.log(endDay);

      orders = await Order.find({
        data: {
          $gte: startDay,
          $lte: endDay
        },
        deliveryStatus: "Canceled",
      });

    } else if(from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      orders = await Order.find({
        data: {
          $gte: startOfDay,
          $lt: endOfDay
        },
        deliveryStatus: "Canceled"
      });
    } else {
      orders = [];
    }

    const periods = calculatePeriods(from, to);

    const data = groupOrdersByPeriods(orders, periods);

    const canceledOrders: { [key: string]: number } = {};

    for(const period in data) {
      const ordersInPeriod = data[period];

      canceledOrders[period] = ordersInPeriod.length;
    }

    console.log(canceledOrders);

    const transformedData = Object.entries(canceledOrders).map(([dateName, orders]) => ({
      dateName,
      value: orders
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding canceled orders: ${error.message}`)
  }
}

export async function findAddedToCart(from: Date | undefined, to: Date | undefined) {
  try {
    connectToDB();

    const products = await Product.find();

    const periods = calculatePeriods(from, to);

    const productsAddedToCart: { [key: string]: number } = {};

    periods.forEach(period => {
      const periodKey = period.dateName;
      productsAddedToCart[periodKey] = 0;
    })

    products.forEach(product => {
      product.addedToCart.forEach((addedTime: Date) => {
        const addedDate= moment(addedTime);

        periods.forEach(period => {
          const periodKey = period.dateName;

          if(periodKey.includes(' - ')) {
            const [start, end] = periodKey.split(' - ');
            const format = determineDateFormat(start);
  
            const startDate = moment(start, format);
            let endDate = moment(end, format);

            if (format === 'YYYY-MM-DD HH:00') {
              endDate = endDate.endOf('hour');
            } else if (format === 'YYYY-MM-DD') {
              endDate = endDate.endOf('day');
            } else if (format === 'YYYY-MM') {
              endDate = endDate.endOf('month');
            } else if (format === 'YYYY') {
              endDate = endDate.endOf('year');
            }

            if(addedDate.isBetween(startDate, endDate, undefined, '[]')) {
              productsAddedToCart[periodKey] += 1;
            }
          } else {
            const format = determineDateFormat(periodKey);
  
    
            const date = moment(periodKey, format);
    
            if (
              (format === 'YYYY-MM-DD HH:00' && addedDate.isSame(date, 'hour')) ||
              (format === 'YYYY-MM-DD' && addedDate.isSame(date, 'day')) ||
              (format === 'YYYY-MM' && addedDate.isSame(date, 'month')) ||
              (format === 'YYYY' && addedDate.isSame(date, 'year'))
            ) {
              productsAddedToCart[periodKey] += 1;
            }
          }
        })
      })
    })

    console.log(productsAddedToCart);

    const transformedData = Object.entries(productsAddedToCart).map(([dateName, addedToCart]) => ({
      dateName,
      value: addedToCart
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding products added to cart: ${error.message}`)
  }
}

export async function findNewCustomers(from: Date | undefined, to: Date | undefined) {
  try {
    await connectToDB();

    let users = [];

    if (from && to) {
      const startDay = new Date(from);
      startDay.setHours(0, 0, 0, 0);

      const endDay = new Date(to);
      endDay.setHours(23, 59, 59, 999);

      users = await User.find({
        "orders.createdAt": {
          $gte: startDay
        },
      }).populate({
        path: 'orders.order'
      });

    } else if (from) {
      const startOfDay = new Date(from);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(from);
      endOfDay.setHours(23, 59, 59, 999);

      users = await User.find({
        "orders.createdAt": {
          $gte: startOfDay
        }
      }).populate({
        path: 'orders.order'
      });

    } else {
      return []; //Return empty object if no date range is provided
    }


    console.log(users);

    let firstOrders: Order[] = [];
    
    users.forEach((user) => {
      if(user.orders.length > 0) {
        const sortedOrders = user.orders.sort((current: { order: Order, createdAt: Date }, previous: { order: Order, createdAt: Date }) => current.createdAt.getTime() - previous.createdAt.getTime());

        firstOrders.push(sortedOrders[0].order);
      }
    })
    const periods = calculatePeriods(from, to);
    const data = groupOrdersByPeriods(firstOrders, periods);

    const newCustomerOrders: { [key: string]: number } = {};

    for (const period in data) {
      const ordersInPeriod = data[period];

      newCustomerOrders[period] = ordersInPeriod.length;
    }

    console.log("New customers", newCustomerOrders);

    const transformedData = Object.entries(newCustomerOrders).map(([dateName, customer]) => ({
      dateName,
      value: customer
    }))

    console.log(transformedData);

    const reformatedData = reformat(transformedData);

    console.log(reformatedData);

    return reformatedData;
  } catch (error: any) {
    throw new Error(`Error finding new customers: ${error.message}`);
  }
}

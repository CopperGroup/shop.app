"use server";

import Order from "../models/order.model";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import mongoose from 'mongoose';
import { revalidatePath } from "next/cache";
import moment from "moment";

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

        await user.orders.push(createdOrder._id);

        await User.findById(userId).updateOne({
          name: name,
          surname: surname,
          phoneNumber: phoneNumber
        })

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
        const yesterday = moment().subtract(1, "days");
        const lastWeek = moment().subtract(1, "weeks").startOf('isoWeek');
        const lastMonth = moment().subtract(1, "months").startOf('month');
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
            if (dayIndex >= 0 && dayIndex < month.length && orderDate.month() === moment().month()) {
              month[dayIndex].orders.push(order);
              month[dayIndex].totalValue += orderValue;
              month[dayIndex]. totalOrders += 1;
              monthTotalValue += orderValue;
              monthTotalOrders += 1;
              order.products.forEach((product: { product: string, amount: number; }) => {
                monthTotalProductsSold += product.amount,
                monthPopularProducts[product.product] = (monthPopularProducts[product.product] || 0) + product.amount
              })
            }

            const previousDayIndex = orderDate.date() - 1;
            if (previousDayIndex >= 0 && previousDayIndex < previousMonth.length && orderDate.month() === lastMonth.month()) {
                previousMonth[previousDayIndex].orders.push(order);
                previousMonth[previousDayIndex].totalValue += orderValue;
                previousMonth[previousDayIndex].totalOrders += 1;
                previousMonthTotalValue += orderValue;
                previousMonthTotalOrders += 1;
                order.products.forEach((product: { product: string, amount: number; }) => {
                    previousMonthTotalProductsSold += product.amount;
                    previousMonthPopularProducts[product.product] = (previousMonthPopularProducts[product.product] || 0) + product.amount;
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
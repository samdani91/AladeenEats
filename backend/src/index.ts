// index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import paymentMethodRoute from "./routes/PaymentMethodRoute";
import deliveryAgentRoute from "./routes/DeliveryAgentRoute";
import promotionRoute from "./routes/PromotionRoute";
import reviewRoute from "./routes/ReviewRoute";
import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import http from "http";
import DeliveryAgent from "./models/deliveryAgent";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: process.env.FRONTEND_URL,
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);
app.use("/api/my/payment-method", paymentMethodRoute);
app.use("/api/delivery-agent", deliveryAgentRoute);
app.use("/api/promotion", promotionRoute);
app.use("/api/review", reviewRoute);

// WebSocket for real-time delivery agent updates
io.on("connection", (socket) => {
  socket.on("updateAgentLocation", async (data: { orderId: string; longitude: number; latitude: number }) => {
    try {
      const { orderId, longitude, latitude } = data;
      await DeliveryAgent.findOneAndUpdate(
        { order: orderId },
        {
          location: { type: "Point", coordinates: [longitude, latitude] },
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
      io.emit(`agentLocation:${orderId}`, { location: { type: "Point", coordinates: [longitude, latitude] } });
    } catch (error) {
      console.log(error);
    }
  });
});

server.listen(7000, () => {
  console.log("server started on localhost:7000");
});
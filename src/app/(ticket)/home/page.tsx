"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

const HomePage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [from, setFromCity] = useState<string>("");
  const [to, setToCity] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const supabase = createClient();
  const fetchTickets = async () => {
    if (!from || !to || !date) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }
    const { data, error }: { data: any[] | null; error: any } = await supabase
      .from("AvtoTicket")
      .select("*")
      .eq("from", from)
      .eq("to", to)
      .eq("date", date);

    if (error) {
      console.error("Xatolik:", error.message);
      return;
    }

    if (data) {
      localStorage.setItem("selectedTicket", JSON.stringify(data));
      setTickets(data);
      router.push("/byticket");
      setFromCity("");
      setToCity("");
      setDate("");
    }
  };

  return (
    <div className="home bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen">
      <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div
            className="text-gray-900 text-3xl font-bold cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <span className="text-red-600">TICKET</span>BOOKING
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Admin Panel
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-start h-screen w-full px-6 pt-32">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
            Chipta Izlash
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={from}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="" disabled>From</option>
              {["Toshkent", "Buxoro", "Farg'ona", "Xorazm", "Surxondaryo", "Jizzax", "Samarqand", "Navoiy", "Qashqadaryo", "Andijon", "Namangan", "Qoraqalpog'iston"].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={to}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="" disabled>To</option>
              {["Toshkent", "Buxoro", "Farg'ona", "Xorazm", "Surxondaryo", "Jizzax", "Samarqand", "Navoiy", "Qashqadaryo", "Andijon", "Namangan", "Qoraqalpog'iston"].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              type="date"
              min="2025-03-01"
              max="2025-03-31"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <button
            onClick={fetchTickets}
            className="mt-4 w-full bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition duration-300"
          >
            Chipta izlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

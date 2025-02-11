"use client";
import {  useState } from "react";
import { createClient } from "@/supabase/client";

interface Ticket {
  id: number;
  from: string;
  to: string;
  date: string;
  price: number;
  count: number;
}

interface BuyerInfo {
  name: string;
  lastname: string;
  email: string;
  ticketCount: number;
}

const BuyTicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: "",
    lastname: "",
    email: "",
    ticketCount: 1,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const supabase = createClient();


  const handleBuyClick = (ticketId: number) => {
    setSelectedId(ticketId);
    setShowForm(true);
  };

  const ChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const TicketSubmit = async () => {
    if (!buyerInfo.name || !buyerInfo.lastname || !buyerInfo.email) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const ticketToUpdate = selectedTicket.find((t) => t.id === selectedId);
    if (!ticketToUpdate) {
      alert("Xatolik: Chipta topilmadi!");
      return;
    }

    if (ticketToUpdate.count < buyerInfo.ticketCount) {
      alert("Yetarlicha chipta yo‘q!");
      return;
    }

    const newCount = ticketToUpdate.count - buyerInfo.ticketCount;

    const { error } = await supabase.from("TicketUsers").insert([
      {
        Name: buyerInfo.name,
        LastName: buyerInfo.lastname,
        Email: buyerInfo.email,
        Ticket: selectedId,
        TicketCount: buyerInfo.ticketCount,
      },
    ]);

    if (error) {
      console.error("Xatolik yuz berdi:", error.message);
      alert(`Ma'lumotlar qo'shishda xatolik: ${error.message}`);
      return;
    }

    alert("Chipta muvaffaqiyatli sotib olindi!");

    const { error: updateError } = await supabase
      .from("AvtoTicket")
      .update({ count: newCount })
      .match({ id: selectedId });

    if (updateError) {
      console.error("Chipta miqdorini yangilashda xatolik:", updateError.message);
    }

    setShowForm(false);
    setBuyerInfo({ name: "", lastname: "", email: "", ticketCount: 1 });
  };

  if (selectedTicket.length === 0) {
    return (
      <p className="text-center mt-32 text-2xl text-gray-500 font-semibold">
        ❌ Chipta topilmadi
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-500 to-gray-900 min-h-screen">
      <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div
            className="text-gray-900 text-3xl font-extrabold hover:cursor-pointer"
            onClick={() => (window.location.href = "/home")}
          >
            <span className="text-red-600">TICKET</span>BOOKING 🎫
          </div>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Admin Panel
          </button>
        </div>
      </nav>

      <div className="mt-32 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {selectedTicket.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="border-b border-gray-300 py-4 flex justify-between">
              <div>
                <p className="text-gray-700 text-lg font-semibold">
                  <strong>{ticket.from}</strong> ➝ <strong>{ticket.to}</strong>
                </p>
                <p className="text-gray-500">📅 Sana: {ticket.date}</p>
              </div>
              <p className="text-red-600 font-bold text-xl">{ticket.price} UZS</p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => handleBuyClick(ticket.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
              >
                🎟 Sotib olish
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
              📋 Ma`lumotlarni kiriting
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Ism"
              value={buyerInfo.name}
              onChange={ChangeValue}
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Familiya"
              value={buyerInfo.lastname}
              onChange={ChangeValue}
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={buyerInfo.email}
              onChange={ChangeValue}
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="ticketCount"
              placeholder="Chipta soni"
              min={1}
              max={4}
              value={buyerInfo.ticketCount}
              onChange={ChangeValue}
              className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={TicketSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 font-semibold"
            >
              ✅ Tasdiqlash
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="w-full bg-gray-500 text-white py-2 mt-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
            >
              ❌ Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTicketPage;

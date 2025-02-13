"use client";
import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";

interface Ticket {
  id: number;
  from: string;
  to: string;
  date: string;
  price: number;
  count: number;
}

const BuyTicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    lastname: "",
    email: "",
    ticketCount: 1,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const ticketData = localStorage.getItem("selectedTicket");
    if (ticketData) {
      setSelectedTicket(JSON.parse(ticketData));
    }
  }, []);

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
      console.error(
        "Chipta miqdorini yangilashda xatolik:",
        updateError.message
      );
    }

    setShowForm(false);
    setBuyerInfo({ name: "", lastname: "", email: "", ticketCount: 1 });
  };

  if (selectedTicket.length === 0) {
    return (
      <p className="text-center mt-32 text-xl text-gray-500">
        Chipta topilmadi
      </p>
    );
  }

  return (
    <div>
      <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div
            className="text-gray-900 text-3xl font-bold hover:cursor-pointer"
            onClick={() => (location.href = "/home")}
          >
            <span className="text-red-600">TICKET</span>BOOKING          </div>

          <button
            onClick={() => (location.href = "/admin")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Admin Page
          </button>
        </div>
      </nav>

      <div className="mt-32 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTicket.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
          >
            <div className="border-b border-gray-300 py-4 flex justify-between">
              <div>
                <p className="text-gray-700">
                  <strong>{ticket.from}</strong> → <strong>{ticket.to}</strong>
                </p>
                <p className="text-gray-500">Sana: {ticket.date}</p>
              </div>
              <p className="text-red-600 font-bold">{ticket.price} UZS</p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => handleBuyClick(ticket.id)}
                className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition duration-300"
              >
                Sotib olish
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-center text-xl font-bold mb-4">
            Ma&apos;lumotlarni kiriting
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Ism"
            value={buyerInfo.name}
            onChange={ChangeValue}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Familiya"
            value={buyerInfo.lastname}
            onChange={ChangeValue}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={buyerInfo.email}
            onChange={ChangeValue}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            max={4}
            min={1}
            type="number"
            name="ticketCount"
            placeholder="Ticket Count"
            value={buyerInfo.ticketCount}
            onChange={ChangeValue}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={TicketSubmit}
            className="w-full bg-red-600 text-white py-2 rounded-md shadow-md hover:bg-red-700 transition duration-300"
          >
            Tasdiqlash
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyTicketPage;

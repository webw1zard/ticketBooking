"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Ticket {
  id: number;
  from: string;
  to: string;
  price: string;
  count: string;
  time: string;
  date: string;
}

const AdminPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [from, setFromCity] = useState<string>("");
  const [to, setToCity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const supabase = createClient()
    fetchTickets();

  async function fetchTickets() {
    const { data, error } = await supabase.from("AvtoTicket").select("*");
    if (error) {
      console.error("Error fetching tickets:", error);
    } else {
      setTickets(data as Ticket[]);
    }
  }

  const createTicket = async () => {
    if (!from || !to || !price || !count || !time || !date) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    if (from === to) {
      toast.error("Qayerdan va qayerga shaharlar farqli bo'lishi kerak.");
      return;
    }

    if (editingTicket) {
      const { error } = await supabase
        .from("AvtoTicket")
        .update({ from, to, price, count, time, date })
        .eq("id", editingTicket.id);

      if (error) {
        console.error("Update error:", error);
      } else {
        setEditingTicket(null);
        fetchTickets();
      }
    } else {
      const { error } = await supabase
        .from("AvtoTicket")
        .insert([{ from, to, price, count, time, date }]);

      if (error) {
        console.error("Insert error:", error);
        toast.error("Ticket qo'shishda xatolik yuz berdi! ❌");
      } else {
        toast.success("Ticket muvaffaqiyatli qo'shildi! 🎉");
        fetchTickets();
      }
    }

    setFromCity("");
    setToCity("");
    setPrice("");
    setCount("");
    setTime("");
    setDate("");
  };

  function editTicket(ticket: Ticket) {
    setEditingTicket(ticket);
    setFromCity(ticket.from);
    setToCity(ticket.to);
    setPrice(ticket.price);
    setCount(ticket.count);
    setTime(ticket.time);
    setDate(ticket.date);
  }

  async function deleteTicket(id: number) {
    const { error } = await supabase.from("AvtoTicket").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
    } else {
      fetchTickets();
    }
  }

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-900 min-h-screen">
      <ToastContainer />
      <nav className="bg-gray-900 p-4 shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="text-white text-3xl font-bold cursor-pointer"
            onClick={() => (window.location.href = "/home")}
          >
            <span className="text-blue-500">TICKET</span>BOOKING
          </div>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="bg-gradient-to-r from-black to-pink-900 text-white px-6 py-2 rounded-full shadow-lg hover:from-pink-500 hover:to-red-500 transition duration-300"
          >
            Admin Page
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminPage;
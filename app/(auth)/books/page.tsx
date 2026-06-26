"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal, Form, Input, InputNumber, QRCode, Button, Select} from 'antd';

// Constants
const PRICE_PER_BOOK = 346476;
const COMBO_PRICE = 5543616;

// Đồng bộ giá TCG mới để hệ thống xử lý chính xác khi tính toán tổng tiền
const PRICE_TCG_BOX = 2300000;
const PRICE_TCG_DECK = 846255;
const PRICE_TCG_PACK = 200000;

interface Book {
  id: number | string;
  title: string;
  image: string | string[]; // Cập nhật để nhận array ảnh cho combo
  isCombo?: boolean;
}

interface OrderFormValues {
  name: string;
  address: string;
  phone: string;
  volume: string;
  quantity: number;
}

export default function BooksPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [form] = Form.useForm<OrderFormValues>();
  
  // State quản lý việc chuyển đổi ảnh cho Combo
  const [comboImageIndex, setComboImageIndex] = useState(0);

  // Mảng ảnh cho Combo
  const comboImages = [
    "/combo vol 1-16 (1).jpg",
    "/combo vol 1-16 (2).jpg", 
    "/combo vol 1-16 (3).jpg",  
  ];

  // Logic tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setComboImageIndex((prev) => (prev + 1) % comboImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [comboImages.length]);

  const bookList: Book[] = [
    { id: "combo", title: "FULL COMBO VOL 1-16", image: comboImages, isCombo: true },
    { id: 1, title: "Tokyo Ghoul RE Vol 1", image: "/vol 1.jpg" },
    { id: 2, title: "Tokyo Ghoul RE Vol 2", image: "/vol 2.jpg" },
    { id: 3, title: "Tokyo Ghoul RE Vol 3", image: "/vol 3.jpg" },
    { id: 4, title: "Tokyo Ghoul RE Vol 4", image: "/vol 4.jpg" },
    { id: 5, title: "Tokyo Ghoul RE Vol 5", image: "/vol 5.jpg" },
    { id: 6, title: "Tokyo Ghoul RE Vol 6", image: "/vol 6.jpg" },
    { id: 7, title: "Tokyo Ghoul RE Vol 7", image: "/vol 7.jpg" },
    { id: 8, title: "Tokyo Ghoul RE Vol 8", image: "/vol 8.jpg" },
    { id: 9, title: "Tokyo Ghoul RE Vol 9", image: "/vol 9.jpg" },
    { id: 10, title: "Tokyo Ghoul RE Vol 10", image: "/vol 10.jpg" },
    { id: 11, title: "Tokyo Ghoul RE Vol 11", image: "/vol 11.jpg" },
    { id: 12, title: "Tokyo Ghoul RE Vol 12", image: "/vol 12.jpg" },
    { id: 13, title: "Tokyo Ghoul RE Vol 13", image: "/vol 13.jpg" },
    { id: 14, title: "Tokyo Ghoul RE Vol 14", image: "/vol 14.jpg" },
    { id: 15, title: "Tokyo Ghoul RE Vol 15", image: "/vol 15.jpg" },
    { id: 16, title: "Tokyo Ghoul RE Vol 16", image: "/vol 16.jpg" },
  ];

  const handleBuyClick = (book: Book) => {
    setSelectedBook(book);
    const initialPrice = book.isCombo ? COMBO_PRICE : PRICE_PER_BOOK;
    setTotalAmount(initialPrice);
    form.setFieldsValue({ quantity: 1, volume: book.title });
    setIsConfirmOpen(true);
  };

  const handleConfirmYes = () => {
    setIsConfirmOpen(false);
    setIsInfoOpen(true);
  };

  const onValuesChange = (changedValues: Partial<OrderFormValues>, allValues: OrderFormValues) => {
    const isCurrentCombo = allValues.volume === "FULL COMBO VOL 1-16";
    
    // Cập nhật cấu hình tính toán động đồng bộ giá TCG khi người dùng thay đổi item trong Select Dropdown của Modal
    let basePrice = isCurrentCombo ? COMBO_PRICE : PRICE_PER_BOOK;
    if (allValues.volume === "UNION ARENA BOOSTER BOX") basePrice = PRICE_TCG_BOX;
    if (allValues.volume === "UNION ARENA STARTER DECK") basePrice = PRICE_TCG_DECK;
    if (allValues.volume === "UNION ARENA SINGLE PACK") basePrice = PRICE_TCG_PACK;

    if (changedValues.quantity !== undefined || changedValues.volume !== undefined) {
      setTotalAmount(allValues.quantity * basePrice);
    }
  };
const handleFinish = (values: OrderFormValues) => {
    const emailTo = "daongoc.phuongmy308@gmail.com";
    const subject = encodeURIComponent(`Order: ${values.volume}`);

    const body = encodeURIComponent(
      `Name: ${values.name}\n` +
      `Address: ${values.address}\n` +
      `Phone number: ${values.phone}\n` +
      `Products: ${values.volume}\n` +
      `Quantity: ${values.quantity}\n` +
      `Sum: ${totalAmount.toLocaleString()} VND`
    );

    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

    setIsInfoOpen(false);
    form.resetFields();
  };

  return (
    <section className="bg-white min-h-screen text-black selection:bg-[#df2531] selection:text-white pb-20">
      <div className="py-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50 border-b-2 border-black mb-16">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
          Books
        </h1>
        <div className="h-2 w-24 bg-[#df2531] mt-6"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bookList.map((book) => (
            <div 
              key={book.id} 
              className={`group border-[3px] border-black rounded-[30px] p-6 flex flex-col items-center bg-white transition-all duration-300 hover:shadow-[15px_15px_0px_0px_#df2531] hover:-translate-y-1 ${book.isCombo ? 'border-[#df2531] ring-2 ring-[#df2531] ring-offset-2' : ''}`}
            >
              <div className="relative w-full h-64 mb-6 overflow-hidden">
                <Image 
                  // Nếu là combo thì dùng comboImageIndex, nếu không thì dùng image bình thường
                  src={book.isCombo ? (book.image as string[])[comboImageIndex] : (book.image as string)} 
                  alt={book.title} 
                  fill 
                  className="object-contain transition-all duration-700 ease-in-out group-hover:scale-105" 
                />
                {/* Chỉ hiện chấm tròn báo hiệu ảnh cho combo */}
                {book.isCombo && (
                    <div className="absolute bottom-0 flex gap-1 justify-center w-full">
                        {comboImages.map((_, idx) => (
                            <div key={idx} className={`h-1 w-4 rounded-full ${idx === comboImageIndex ? 'bg-[#df2531]' : 'bg-gray-300'}`} />
                        ))}
                    </div>
                )}
              </div>

              <div className="w-full space-y-4">
                <div className="min-h-12.5 flex items-center justify-center">
                  <span className={`text-center font-black uppercase text-sm px-4 py-1 rounded-full border-2 border-black ${book.isCombo ? 'bg-[#df2531] text-white border-[#df2531]' : ''}`}>
                    {book.title}
                  </span>
                </div>
                
                <p className="text-xl font-black text-center italic">
                  {book.isCombo ? COMBO_PRICE.toLocaleString() : PRICE_PER_BOOK.toLocaleString()} VND
                </p>

                <button 
                  onClick={() => handleBuyClick(book)}
                  className="w-full py-3 bg-black text-white font-black rounded-xl hover:bg-[#df2531] uppercase text-xs tracking-widest transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 flex justify-center">
        <Link href="/others" className="px-10 py-4 border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_#df2531]">
          Return
        </Link>
      </div>

      {/* Modal 1: Confirm */}
      <Modal title={null} open={isConfirmOpen} onCancel={() => setIsConfirmOpen(false)} footer={null} centered width={300}>
        <div className="text-center p-4">
          <h3 className="text-xl font-bold mb-6 italic uppercase text-black">Are you sure?</h3>
          <div className="flex justify-center gap-4">
            <button onClick={handleConfirmYes} className="px-6 py-2 bg-[#df2531] text-white font-bold rounded-md">YES</button>
            <button onClick={() => setIsConfirmOpen(false)} className="px-6 py-2 bg-gray-200 font-bold rounded-md">NO</button>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Info & Payment */}
      <Modal
        title={<span className="text-2xl font-black italic uppercase text-black">Order Information</span>}
        open={isInfoOpen}
        onCancel={() => setIsInfoOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <Form form={form} layout="vertical" onFinish={handleFinish} onValuesChange={onValuesChange} initialValues={{ quantity: 1, volume: selectedBook?.title }}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input placeholder="Delivery address" />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="Your phone number" />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item name="volume" label="Select Item" className="flex-1">
                <Select>
                  <Select.OptGroup label="Manga Books">
                    <Select.Option value="FULL COMBO VOL 1-16">Combo Vol 1-16</Select.Option>
                    {[...Array(16)].map((_, i) => (
                      <Select.Option key={i + 1} value={`Tokyo Ghoul RE Vol ${i + 1}`}>Vol {i + 1}</Select.Option>
                    ))}
                  </Select.OptGroup>
                  <Select.OptGroup label="Trading Card Game">
                    <Select.Option value="UNION ARENA BOOSTER BOX">Booster Box</Select.Option>
                    <Select.Option value="UNION ARENA STARTER DECK">Starter Deck</Select.Option>
                    <Select.Option value="UNION ARENA SINGLE PACK">Single Pack</Select.Option>
                  </Select.OptGroup>
                </Select>
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" className="w-24">
                <InputNumber min={1} max={100} />
              </Form.Item>
            </div>
            <div className="mb-6 p-4 bg-gray-50 border-l-4 border-[#df2531]">
              <p className="text-sm text-gray-500">Total Price:</p>
              <p className="text-2xl font-black text-[#df2531]">{totalAmount.toLocaleString()} VND</p>
            </div>
            <Button type="primary" htmlType="submit" block className="h-12 font-bold text-lg uppercase">
              Confirm & Open Email
            </Button>
          </Form>

          <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-4">
            <p className="font-bold mb-4 uppercase text-black">Scan to Pay</p>
            <QRCode value={`Payment-Total-${totalAmount}`} color="#df2531" bordered={false} />
          </div>
        </div>
      </Modal>
    </section>
  );
}
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { inputCls } from "./Modal";

export default function ProductAutocomplete({ value, onChange, placeholder = "Masukkan atau pilih produk..." }) {
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        axios.get("/api/products")
            .then((res) => {
                setProducts(res.data.data || []);
            })
            .catch((err) => {
                console.error("Gagal memuat produk untuk autocomplete:", err);
            });
    }, []);

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Trigger suggestions when value changes
    useEffect(() => {
        if (!value) {
            setSuggestions(products);
            return;
        }

        const filtered = products.filter((p) =>
            p.nama_product.toLowerCase().includes(value.toLowerCase()) ||
            (p.deskripsi && p.deskripsi.toLowerCase().includes(value.toLowerCase()))
        );
        setSuggestions(filtered);
    }, [value, products]);

    const handleSelect = (productName) => {
        onChange(productName);
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className={inputCls}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-55 w-full bg-white border border-gray-200 rounded-xl mt-1.5 max-h-52 overflow-y-auto shadow-lg divide-y divide-gray-50">
                    {suggestions.map((p) => (
                        <li
                            key={p.id}
                            onClick={() => handleSelect(p.nama_product)}
                            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-left transition-colors duration-100"
                        >
                            <div className="text-[13px] font-semibold text-gray-800">
                                {p.nama_product}
                            </div>
                            {p.deskripsi && (
                                <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                    {p.deskripsi}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

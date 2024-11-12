"use client";
// lib
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// local
import { cn, OptionsType } from "@/lib";
import { Input, SkeletonLoading } from "@/components/atoms";
import { useClickOutside } from "@/hook";

interface DropdownProps {
  label: string;
  title: string;
  items: OptionsType[];
  multiSelect?: boolean;
  className?: string;
  displayLimit?: number;
  defaultSelected?: string[];
  onSelect?: (selected: { value: string; label: string }[]) => void; // Change onSelect type
  disabled?: boolean;
  loading?: boolean;
  autoSelectFirstItem?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  title,
  items,
  multiSelect = false,
  className,
  displayLimit = 3,
  defaultSelected = [],
  onSelect,
  disabled = false,
  loading = false,
  autoSelectFirstItem = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultSelected);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<OptionsType[]>(items);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (value: string) => {
    if (disabled || loading) return;

    const selectedItem = items.find((item) => item.value === value);
    if (!selectedItem) return;

    let newSelectedItems: string[];
    let newSelectedData: { value: string; label: string }[];

    if (multiSelect) {
      if (selectedItems.includes(value)) {
        newSelectedItems = selectedItems.filter((item) => item !== value);
      } else {
        newSelectedItems = [...selectedItems, value];
      }
    } else {
      newSelectedItems = [value];
      setIsOpen(false);
    }

    setSelectedItems(newSelectedItems);

    // Generate an array of objects with both label and value
    newSelectedData = newSelectedItems.map((val) => {
      const item = items.find((item) => item.value === val);
      return item
        ? { value: item.value, label: item.label }
        : { value: "", label: "" };
    });

    onSelect && onSelect(newSelectedData);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  useEffect(() => {
    const validSelectedItems = selectedItems.filter((selected) =>
      items.some((item) => item.value === selected)
    );

    if (validSelectedItems.length !== selectedItems.length) {
      setSelectedItems(validSelectedItems);
    }
  }, [items, selectedItems]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      items.length > 0 &&
      selectedItems.length === 0 &&
      !loading &&
      autoSelectFirstItem
    ) {
      const firstItem = items[0].value;
      setSelectedItems([firstItem]);
      onSelect && onSelect([{ value: firstItem, label: items[0].label }]);
    }
  }, [items, selectedItems, loading, autoSelectFirstItem, onSelect]);

  const renderSelectedItems = () => {
    const selectedLabels = selectedItems
      .map((value) => items.find((item) => item.value === value)?.label)
      .filter(Boolean);

    if (selectedLabels.length <= displayLimit) {
      return selectedLabels.join(", ");
    } else {
      const visibleItems = selectedLabels.slice(0, displayLimit);
      const remainingCount = selectedLabels.length - displayLimit;
      return `${visibleItems.join(", ")} +${remainingCount}`;
    }
  };

  return (
    <div className={cn(["relative w-full", className])} ref={dropdownRef}>
      <p className="text-body-3 text-gray-900 font-medium mb-1">{label}</p>
      {loading ? (
        <SkeletonLoading className="h-10" />
      ) : (
        <div>
          <button
            className={cn([
              "w-full px-3 py-[10px] bg-white border rounded-lg shadow-xsmall text-left flex justify-between items-center focus:outline-none",
              disabled ? "cursor-not-allowed opacity-50" : "",
            ])}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span
              className={cn([
                "text-body-3 inline-block",
                selectedItems.length > 0 ? "text-gray-700" : "text-gray-400",
              ])}
            >
              {selectedItems.length > 0 ? renderSelectedItems() : title}
            </span>
            <span className="ml-2">
              {isOpen ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
            </span>
          </button>

          {isOpen && !loading && (
            <div className="absolute w-full bg-white border border-gray-300 mt-2 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={disabled}
                />
              </div>

              <ul className="max-h-52 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <li
                      key={index}
                      className={cn([
                        "flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer",
                        disabled ? "cursor-not-allowed" : "",
                      ])}
                      onClick={() => handleSelect(item.value)}
                    >
                      {multiSelect && (
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.value)}
                          readOnly
                          className="form-checkbox mr-2"
                          disabled={disabled}
                        />
                      )}
                      <span className="text-body-3 inline-block">
                        {item.label}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

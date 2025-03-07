"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onSearch: (expedienteId: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [expedienteId, setExpedienteId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(expedienteId);
  };

  return (
    <form
      className="max-w-3xl mx-auto flex items-center gap-2 mb-10 bg-card p-4 rounded-xl"
      onSubmit={handleSubmit}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="N° expediente Ejm.( 000002, 2 )"
          className="pl-10 h-12 rounded-md border-input bg-input"
          value={expedienteId}
          onChange={(e) => setExpedienteId(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md hover:cursor-pointer"
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
}
"use client";

import Link from "next/link";
import { 
  Shield, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  RefreshCcw,
  ChevronRight
} from "lucide-react";
import { policyLinks, PolicyLink } from "@/types/information";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  FileText,
  CreditCard,
  HelpCircle,
  RefreshCcw,
};

interface PolicyCardProps {
  policy: PolicyLink;
  index: number;
}

function PolicyCard({ policy, index }: PolicyCardProps) {
  const Icon = iconMap[policy.icon] || FileText;

  return (
    <Link
      href={policy.href}
      className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300">
          <Icon className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors duration-300" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
            {policy.titleEn}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {policy.description}
          </p>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </Link>
  );
}

interface PolicyLinksProps {
  className?: string;
}

export default function PolicyLinks({ className = "" }: PolicyLinksProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Quick Links
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Find the information you need quickly. Click on any section below to learn more about our policies and guidelines.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {policyLinks.map((policy, index) => (
            <PolicyCard 
              key={policy.id} 
              policy={policy} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

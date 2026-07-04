'use client';

import { useState, type FormEvent } from 'react';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { SectionWrapper, FadeIn } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

export function ContactSection() {
  const { t } = useAppStore();
  const { settings } = useSiteSettings();
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    inquiry: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send');

      toast.success(t.contact.form.success);
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', inquiry: '', message: '' });
    } catch {
      toast.error(t.contact.form.error);
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    { icon: MapPin, label: t.contact.info.headquarters, value: settings?.address || '' },
    { icon: Mail, label: t.contact.info.email, value: settings?.email || '' },
    { icon: Phone, label: t.contact.info.phone, value: settings?.phone || '' },
    { icon: Clock, label: t.contact.info.workingHours, value: settings?.workingHours || '' },
  ];

  return (
    <SectionWrapper
      id="contact"
      badge={t.contact.badge}
      title={t.contact.title}
      subtitle={t.contact.subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
        {/* Form — Left */}
        <FadeIn className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">{t.contact.form.name}</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={t.contact.form.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.contact.form.email}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t.contact.form.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone">{t.contact.form.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={t.contact.form.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t.contact.form.company}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder={t.contact.form.company}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="subject">{t.contact.form.subject}</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder={t.contact.form.subject}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inquiry">{t.contact.form.inquiry}</Label>
                <Select value={formData.inquiry} onValueChange={(v) => handleChange('inquiry', v)}>
                  <SelectTrigger id="inquiry">
                    <SelectValue placeholder={t.contact.form.inquiry} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.contact.form.inquiryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t.contact.form.message}</Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder={t.contact.form.message}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              size="lg"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white"
            >
              {sending ? (
                t.contact.form.sending
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t.contact.form.submit}
                </>
              )}
            </Button>
          </form>
        </FadeIn>

        {/* Info Panel — Right */}
        <FadeIn delay={0.2} className="lg:col-span-2">
          <div className="rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-50 to-white p-6 lg:p-8 h-fit">
            <h3 className="text-lg font-bold text-foreground mb-6">{t.contact.info.headquarters}</h3>
            <ul className="space-y-5">
              {infoItems.filter(item => item.value).map((item, index) => (
                <li key={index} className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-foreground font-medium break-words">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
import { db } from "@/api/db";

import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

export default function AdminEntityManager({
  entityName,
  fields,
  title,
  subtitle,
  itemLabel = 'item',
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.entities[entityName].list('sort_order', 100);
      setRecords(data);
    } catch (e) {
      console.error('Failed to load:', e);
    } finally {
      setLoading(false);
    }
  }, [entityName]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    const defaults = {};
    fields.forEach((f) => {
      if (f.default !== undefined) defaults[f.name] = f.default;
    });
    setForm(defaults);
    setDialogOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setForm({ ...record });
    setDialogOpen(true);
  };

  const slugify = (text) =>
    text.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const save = async () => {
    setSaving(true);
    try {
      const cleanForm = { ...form };
      fields.forEach((f) => {
        if (f.autoSlugFrom && cleanForm[f.autoSlugFrom]) {
          cleanForm[f.name] = slugify(cleanForm[f.autoSlugFrom]);
        }
      });
      delete cleanForm.id;
      delete cleanForm.created_date;
      delete cleanForm.updated_date;
      delete cleanForm.created_by_id;

      if (editing) {
        await db.entities[entityName].update(editing.id, cleanForm);
      } else {
        await db.entities[entityName].create(cleanForm);
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      console.error('Save failed:', e);
      alert('Gagal menyimpan: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await db.entities[entityName].delete(id);
      load();
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Gagal menghapus: ' + (e.message || 'Unknown error'));
    }
  };

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const renderField = (field) => {
    const val = form[field.name];
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={val || ''}
            onChange={(e) => setField(field.name, e.target.value)}
            rows={field.rows || 4}
          />
        );
      case 'richtext':
        return (
          <RichTextEditor
            value={val || ''}
            onChange={(v) => setField(field.name, v)}
          />
        );
      case 'select':
        return (
          <Select
            value={val || ''}
            onValueChange={(v) => setField(field.name, v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'image':
        return (
          <ImageUpload
            value={val}
            onChange={(v) => setField(field.name, v)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={val ?? ''}
            onChange={(e) =>
              setField(field.name, parseFloat(e.target.value) || 0)
            }
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center gap-2 pt-1">
            <Switch
              checked={!!val}
              onCheckedChange={(v) => setField(field.name, v)}
            />
            <span className="text-sm text-gray-500">
              {val ? 'Ya' : 'Tidak'}
            </span>
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            value={val ? val.split('T')[0] : ''}
            onChange={(e) => setField(field.name, e.target.value)}
          />
        );
      default:
        return (
          <Input
            value={val || ''}
            onChange={(e) => setField(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );
    }
  };

  const imageField = fields.find((f) => f.type === 'image');
  const titleField =
    fields.find((f) => f.name === 'title') ||
    fields.find((f) => f.name === 'name') ||
    fields.find((f) => f.name === 'client_name');
  const listFields = fields.filter((f) => f.list);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Button
          onClick={openCreate}
          className="bg-gray-900 hover:bg-gray-800 shrink-0"
        >
          <Plus size={16} className="mr-1" /> Tambah {itemLabel}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={28} />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Belum ada data.</p>
          <p className="text-xs mt-1">
            Klik tombol di atas untuk menambah {itemLabel.toLowerCase()}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col"
            >
              {imageField && r[imageField.name] && (
                <img
                  src={r[imageField.name]}
                  alt=""
                  className="w-full h-28 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                {r[titleField?.name] || 'Untitled'}
              </h3>
              {listFields.map((f) => (
                <p key={f.name} className="text-xs text-gray-500 line-clamp-1">
                  {f.label}: {String(r[f.name] ?? '—')}
                </p>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(r)}
                  className="h-8 px-3"
                >
                  <Pencil size={13} className="mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(r.id)}
                  className="h-8 px-3"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`${fields.some((f) => f.type === 'richtext') ? 'max-w-2xl' : 'max-w-lg'} max-h-[85vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit' : 'Tambah'} {itemLabel}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {fields.filter((f) => !f.hidden).map((field) => (
              <div key={field.name}>
                <Label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {saving && <Loader2 size={16} className="animate-spin mr-1" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
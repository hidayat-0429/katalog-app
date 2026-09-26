import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui'
import MessageActions from './MessageActions'

const ITEMS_PER_PAGE = 15;

export default async function AdminMessagesPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string, page?: string }>
}) {
  const { filter, page } = await searchParams;
  const currentFilter = filter === 'BELUM' || filter === 'DIBACA' ? filter : 'SEMUA';
  const currentPage = Number(page) || 1;

  const where = currentFilter === 'SEMUA'
    ? {}
    : { isRead: currentFilter === 'DIBACA' };

  const [totalCount, unreadCount, messages] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const tabs = [
    { key: 'SEMUA', label: 'Semua' },
    { key: 'BELUM', label: 'Belum dibaca' },
    { key: 'DIBACA', label: 'Sudah dibaca' },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Pesan Masuk</h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
          {totalCount} pesan ditemukan{unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 font-sans text-xs">
        {tabs.map(tab => {
          const isActive = tab.key === currentFilter;
          return (
            <Link
              key={tab.key}
              href={`/admin/pesan${tab.key === 'SEMUA' ? '' : `?filter=${tab.key}`}`}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 ease-out border ${
                isActive
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-semibold'
                  : 'bg-transparent border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Message List */}
      <div className="flex flex-col gap-2.5">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 font-sans"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  {!msg.isRead && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-forest-600 dark:bg-brand-forest-500 shrink-0" aria-label="Belum dibaca" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 break-words">{msg.subject}</div>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">
                      {msg.name} {msg.company ? `(${msg.company})` : ''}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 break-words">
                      {msg.email}{msg.phone ? ` · ${msg.phone}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {!msg.isRead && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-forest-700 dark:text-brand-forest-300 sm:hidden">Baru</span>
                  )}
                  <MessageActions id={msg.id} isRead={msg.isRead} />
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap break-words border-t border-neutral-100 dark:border-neutral-700 pt-3">
                {msg.message}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 text-center text-neutral-500 dark:text-neutral-400 font-sans text-xs">
            {currentFilter === 'BELUM'
              ? 'Tidak ada pesan yang belum dibaca.'
              : currentFilter === 'DIBACA'
                ? 'Belum ada pesan yang dibaca.'
                : 'Belum ada pesan masuk dari formulir kontak.'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm mt-4">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Halaman {currentPage} dari {totalPages} ({totalCount} pesan)
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/pesan?${new URLSearchParams({
                  ...(currentFilter !== 'SEMUA' ? { filter: currentFilter } : {}),
                  page: String(currentPage - 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                  &larr; Sebelumnya
                </Button>
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/pesan?${new URLSearchParams({
                  ...(currentFilter !== 'SEMUA' ? { filter: currentFilter } : {}),
                  page: String(currentPage + 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                  Berikutnya &rarr;
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

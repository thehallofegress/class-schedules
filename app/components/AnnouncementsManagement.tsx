"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, PencilIcon, XIcon, Calendar, Clock } from 'lucide-react';
import { useAnnouncements } from '@/app/hooks/useAnnouncements';
import AddAnnouncementForm from './AddAnnouncementForm';
import ConfirmationDialog from './ConfirmationDialog';
import { Announcement } from './types';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

const AnnouncementsManagement: React.FC = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { announcements, isLoading, error, fetchAnnouncements, deleteAnnouncement } = useAnnouncements();
    const [isEditing, setIsEditing] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info' as 'danger' | 'warning' | 'info',
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: () => { },
    });


    // Refresh data on initial load
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleDeleteClick = (id: string) => {
        setDialogState({
            isOpen: true,
            title: '确认删除',
            message: '您确定要删除这条通知吗？此操作无法撤销。',
            variant: 'danger',
            confirmText: '删除',
            cancelText: '取消',
            onConfirm: () => handleDelete(id),
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAnnouncement(id);
            setDialogState(prev => ({ ...prev, isOpen: false }));
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to delete announcement:', error);
            setDialogState({
                isOpen: true,
                title: '删除失败',
                message: '删除通知失败，请重试。',
                variant: 'danger',
                confirmText: '确定',
                cancelText: '',
                onConfirm: () => setDialogState(prev => ({ ...prev, isOpen: false })),
            });
        }
    };


    const handleEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsEditing(true);
    };

    const handleAddSuccess = () => {
        setEditingAnnouncement(null);
        setIsEditing(false);
        // Automatically refresh data after add/update
        fetchAnnouncements();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'info': return '信息';
            case 'success': return '成功';
            case 'warning': return '警告';
            case 'error': return '错误';
            default: return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return 'bg-blue-100 text-blue-800';
            case 'success': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render an announcement card for mobile view
    const renderAnnouncementCard = (announcement: Announcement) => (
        <div
            key={announcement.id}
            className="mb-4 p-4 bg-white rounded-lg shadow border-l-4 border-l-blue-500"
            style={{
                borderLeftColor: announcement.type === 'info' ? '#3b82f6' :
                    announcement.type === 'success' ? '#10b981' :
                        announcement.type === 'warning' ? '#f59e0b' :
                            announcement.type === 'error' ? '#ef4444' : '#6b7280'
            }}
        >
            <div className="mb-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                    {getTypeLabel(announcement.type)}
                </span>
            </div>

            <p className="text-sm text-gray-900 mb-3">{announcement.message}</p>

            <div className="flex flex-col space-y-1 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>创建于: {formatDate(announcement.created_at)}</span>
                </div>
                <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>有效期至: {formatDate(announcement.expires_at)}</span>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => handleEdit(announcement)}
                    className="flex items-center text-blue-600 hover:text-blue-900"
                >
                    <Edit size={16} className="mr-1" />
                    <span>编辑</span>
                </button>
                <button
                    onClick={() => handleDeleteClick(announcement.id)}
                    className="flex items-center text-red-600 hover:text-red-900"
                >
                    <Trash2 size={16} className="mr-1" />
                    <span>删除</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">通知管理</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                        <PencilIcon size={16} />
                        添加通知
                    </button>
                )}
            </div>

            {/* Add/Edit announcement form */}
            {isEditing && (
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">
                            {editingAnnouncement ? '编辑通知' : '添加新通知'}
                        </h3>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditingAnnouncement(null);
                            }}
                            className="text-gray-600 hover:text-red-600"
                        >
                            <XIcon size={18} />
                        </button>
                    </div>
                    <AddAnnouncementForm
                        existingAnnouncement={editingAnnouncement}
                        onSuccess={handleAddSuccess}
                    />
                </div>
            )}

            {/* Announcements list */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 md:p-6">
                    <h3 className="text-xl font-bold mb-4">通知列表</h3>
                    {isLoading ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">加载中...</p>
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-red-500">
                            <p>加载通知时出错。请重试。</p>
                            <button
                                onClick={fetchAnnouncements}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                重试
                            </button>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            <p>暂无通知。请添加新通知。</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View - Card Layout */}
                            {!isDesktop && (
                                <div className="space-y-4">
                                    {announcements.map(renderAnnouncementCard)}
                                </div>
                            )}

                            {/* Desktop View - Table Layout */}
                            {isDesktop && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通知内容</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">过期时间</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {announcements.map((announcement) => (
                                                <tr key={announcement.id}>
                                                    <td className="px-4 py-4 whitespace-normal">
                                                        <div className="text-sm text-gray-900 max-w-md break-words">{announcement.message}</div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                                                            {getTypeLabel(announcement.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(announcement.created_at)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(announcement.expires_at)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(announcement)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(announcement.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={dialogState.isOpen}
                title={dialogState.title}
                message={dialogState.message}
                onConfirm={() => {
                    dialogState.onConfirm();
                    setDialogState(prev => ({ ...prev, isOpen: false }));
                }}
                onCancel={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
                variant={dialogState.variant}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
            />

        </div>
    );
};

export default AnnouncementsManagement;

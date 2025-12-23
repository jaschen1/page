
import React from 'react';
import { Gift, Zap, Rocket, ExternalLink, ChevronRight } from 'lucide-react';

export const AnnouncementBoard: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none overflow-y-auto">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl pointer-events-auto transform transition-all flex flex-col gap-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400/20 p-2 rounded-xl">
              <Rocket className="text-yellow-400 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">重磅更新 <span className="text-yellow-400">V2.0</span></h1>
          </div>
          <div className="text-[10px] font-semibold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
            2025-12-24 15:00 上线
          </div>
        </div>

        {/* Real Xiaohongshu Profile Card Recreation */}
        <div className="relative overflow-hidden bg-[#ff2442] rounded-[2.5rem] shadow-xl border border-white/10">
          <div className="h-24 bg-gradient-to-b from-black/20 to-transparent absolute top-0 inset-x-0 pointer-events-none" />
          
          <div className="p-6 relative">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-[3px] border-white/90 overflow-hidden shadow-md mb-4 bg-white/10">
              <img 
                src="avatar.png" 
                alt="文弱李工 Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as any).parentElement;
                  if (parent) parent.innerHTML = '<div class="w-full h-full bg-white/20 flex items-center justify-center text-white/50 text-[10px] font-bold">头像</div>';
                }}
              />
            </div>

            {/* Profile Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">文弱李工</h2>
              <p className="text-white/80 text-xs mb-4 font-medium opacity-90">小红书号：592437221</p>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-white/95 text-[13px] font-medium">
                  <span>📟</span> <span>芯片厂程序员</span> <span>👩🏻‍💻</span> <span>Crypto 量化</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/95 text-[13px] font-medium">
                  <span>📍</span> <span>SH &lt;-&gt; HK</span> <span>✈️</span> <span>记录双城生活...</span>
                </div>
              </div>
            </div>

            <div className="h-[0.5px] bg-white/30 w-full mb-6" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="bg-white rounded-full px-3 py-1.5 w-fit flex items-center justify-center">
                  <span className="text-[#ff2442] font-black text-xs">小红书</span>
                </div>
                <div className="text-white/90 text-[11px] leading-tight font-medium">
                  扫描二维码<br/>在小红书找到我
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-1.5 rounded-2xl shadow-lg w-20 h-20 flex items-center justify-center overflow-hidden">
                <img 
                  src="qrcode.png" 
                  alt="文弱李工 QR Code" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as any).parentElement;
                    if (parent) parent.innerHTML = '<div class="text-[8px] text-[#ff2442] font-bold text-center">二维码</div>';
                  }}
                />
              </div>
            </div>
          </div>

          <a 
            href="https://xhslink.com/m/3DuTYG5OTfi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 text-white text-[12px] font-bold border border-white/20 transition-all active:scale-95 shadow-lg group"
          >
            关注 @文弱李工 <ExternalLink size={14} />
          </a>
        </div>

        {/* Features list - Increased text size */}
        <div className="space-y-5">
          <div className="flex gap-4 group">
            <div className="bg-blue-400/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0 group-hover:bg-blue-400/20 transition-colors">
              <Zap className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-0.5">优化手势操作</h3>
              <p className="text-white/60 text-sm leading-relaxed">更顺滑的交互体验，旋转缩放响应灵敏，指尖丝滑掌控。</p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="bg-pink-400/10 rounded-xl w-12 h-12 flex items-center justify-center shrink-0 group-hover:bg-pink-400/20 transition-colors">
              <Gift className="text-pink-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-0.5">新增礼赠功能</h3>
              <p className="text-white/60 text-sm leading-relaxed">一键定制专属链接，赠送他人后对方无需重复上传照片，惊喜即刻开启。</p>
            </div>
          </div>
        </div>

        {/* Christmas Message Section - Increased text size */}
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 text-center shadow-inner">
            <p className="text-sm sm:text-base text-amber-200 leading-relaxed font-semibold">
              圣诞节期间流量骤增，本站服务器已满载，<br/>
              请<span className="text-amber-400 underline underline-offset-4 decoration-amber-500/50">点赞收藏评论点好</span>作者的最新笔记，<br/>
              可获得最新网址优先使用
            </p>
          </div>
          
          <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/30 transition-all active:scale-95 text-base">
            立即查看最新笔记 <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.25em] font-black">
          Merry Christmas 2025 • @文弱李工
        </p>
      </div>
    </div>
  );
};

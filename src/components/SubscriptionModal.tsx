import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Crown, Zap, Shield, Star, X } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row"
          >
            {/* Left Side - Visual/Marketing */}
            <div className="md:w-5/12 bg-zinc-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                  <Crown size={32} className="text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">
                  Unlock Your Full Creative Potential
                </h2>
                <p className="text-zinc-400 text-lg font-medium">
                  Join 5,000+ professional designers using our Pro tools to build their dreams.
                </p>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Star size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Rated 4.9/5</p>
                    <p className="text-xs text-zinc-500">By industry experts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Plans */}
            <div className="md:w-7/12 p-12 relative">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-2">Select Your Plan</h3>
                  <p className="text-zinc-500 font-medium">Choose the plan that fits your design workflow.</p>
                </div>

                <div className="grid gap-4">
                  {/* Free Plan */}
                  <div className="p-6 rounded-3xl border-2 border-zinc-100 bg-zinc-50/50 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center">
                        <Zap size={24} className="text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">Basic Plan</h4>
                        <p className="text-xs text-zinc-500">Standard layout tools</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-zinc-900">Free</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Plan</p>
                    </div>
                  </div>

                  {/* Pro Plan */}
                  <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                      Recommended
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Crown size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">Professional Pro</h4>
                        <p className="text-xs text-zinc-500">All AI tools & Catalog</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-zinc-900">₹999</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Per Month</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">What's included in Pro:</p>
                  <div className="grid grid-cols-2 gap-y-3">
                    {[
                      'AI Layout Generation',
                      'Full Material Catalog',
                      'Trend Analysis Tool',
                      'Material Estimator',
                      'Compliance Checker',
                      'Priority Support'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-zinc-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={onUpgrade}
                  className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-3"
                >
                  Upgrade to Pro Now <Zap size={18} className="fill-current" />
                </button>

                <p className="text-center text-[10px] text-zinc-400 font-medium">
                  Secure payment via Stripe. Cancel anytime. 
                  <br />By upgrading, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ProGatedFeatureProps {
  isPro: boolean;
  onUpgradeClick: () => void;
  children: React.ReactNode;
  title?: string;
}

export const ProGatedFeature: React.FC<ProGatedFeatureProps> = ({ isPro, onUpgradeClick, children, title }) => {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative group h-full">
      <div className="filter blur-[12px] pointer-events-none select-none opacity-40 h-full">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[4px] rounded-[40px] z-10 p-12 text-center border-2 border-dashed border-zinc-200 m-2">
        <div className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center mb-8 shadow-2xl shadow-zinc-900/40 relative">
          <Shield size={40} className="text-emerald-500" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <Crown size={16} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">
          {title || 'Professional Tool Locked'}
        </h3>
        <p className="text-sm text-zinc-500 font-medium max-w-sm mb-10 leading-relaxed">
          Unlock our advanced AI-powered design suite to develop your ideas with professional precision. 
          <br /><span className="text-emerald-600 font-bold">Pay once to activate all premium features.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button 
            onClick={onUpgradeClick}
            className="flex-1 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2 group"
          >
            Upgrade to Pro <Crown size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <p className="mt-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          Basic features remain free forever
        </p>
      </div>
    </div>
  );
};

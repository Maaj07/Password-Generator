"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Shield, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generatePassword, generateSecurePassword, calculateStrength, getStrengthLabel } from "@/lib/password-utils";
import { md5 } from "@/lib/md5";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(0);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [manualPassword, setManualPassword] = useState("");
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState<"SHA-256" | "MD5" | "Base64">("SHA-256");
  const [inputError, setInputError] = useState(false);

  // Handle manual input change with validation
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Check if deleting (always allow)
    if (val.length < manualPassword.length) {
      setManualPassword(val);
      setInputError(false);
      return;
    }

    // Build regex based on options
    let pattern = "";
    if (options.includeLowercase) pattern += "a-z";
    if (options.includeUppercase) pattern += "A-Z";
    if (options.includeNumbers) pattern += "0-9";
    // For symbols, allowing standard special characters including space
    if (options.includeSymbols) pattern += "\\W_";

    // Create regex: ^[pattern]*$
    // If pattern is empty (nothing selected), only empty string matches.
    const regex = new RegExp(`^[${pattern}]*$`);

    if (regex.test(val)) {
      setManualPassword(val);
      setLength(val.length);
      setInputError(false);
    } else {
      // Blocked character
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
    }
  };

  useEffect(() => {
    const computeHash = async () => {
      if (!manualPassword) {
        setHash("");
        return;
      }
      try {
        if (algorithm === "Base64") {
          setHash(btoa(manualPassword));
        } else if (algorithm === "MD5") {
          setHash(md5(manualPassword));
        } else {
          // SHA-256
          const msgBuffer = new TextEncoder().encode(manualPassword);
          const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          setHash(hashHex);
        }
      } catch (error) {
        console.error(error);
        setHash("Error calculating hash");
      }
    };
    computeHash();
  }, [manualPassword, algorithm]);

  const handleGenerate = useCallback(() => {
    if (!manualPassword) {
      toast.error("Please enter text to generate a password");
      return;
    }

    // Scramble manual input
    const newPassword = generateSecurePassword(manualPassword, { length, ...options });

    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
    setCopied(false);
  }, [length, options, manualPassword]);



  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy password");
    }
  };

  const getStrengthColor = (s: number) => {
    if (s <= 1) return "bg-destructive";
    if (s === 2) return "bg-orange-500";
    if (s === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Background blobs for glassmorphism effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Password Generator
            </CardTitle>
            <CardDescription>
              Create strong, secure passwords instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Manual Password Entry */}
            <div className="space-y-2">
              <Label htmlFor="manual-password" className="text-sm font-medium">Manual Password Entry</Label>
              <motion.input
                id="manual-password"
                type="text"
                placeholder="Type to..."
                className={cn(
                  "w-full bg-background/50 border rounded-xl p-3 text-sm shadow-inner transition-colors focus:outline-none focus:ring-1 text-foreground",
                  inputError
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-input focus:border-primary/50 focus:ring-primary/20"
                )}
                value={manualPassword}
                onChange={handleManualChange}
                animate={inputError ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>

            {/* Hashed Password Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Algorithm: {algorithm}</Label>
                <div className="flex gap-1">
                  {(["SHA-256", "MD5", "Base64"] as const).map((algo) => (
                    <button
                      key={algo}
                      onClick={() => setAlgorithm(algo)}
                      className={cn(
                        "text-[10px] px-2 py-1 rounded transition-colors border",
                        algorithm === algo
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-3 min-h-[48px] flex items-center break-all text-xs font-mono text-muted-foreground">
                {hash || <span className="opacity-50 italic">Waiting for input...</span>}
              </div>
            </div>

            {/* Password Display */}
            <div className="relative group">
              <div className="bg-background/50 border border-input rounded-xl p-4 min-h-[64px] flex items-center justify-center text-center break-all text-xl font-mono tracking-wider shadow-inner transition-colors group-hover:border-primary/50 text-foreground">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={password}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {password || <span className="opacity-50 text-base italic">high-security random format..</span>}
                  </motion.span>
                </AnimatePresence>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-background/80 text-muted-foreground hover:text-foreground"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Strength</span>
                <span className={cn("transition-colors",
                  strength <= 1 ? "text-destructive" :
                    strength === 2 ? "text-orange-500" :
                      strength === 3 ? "text-yellow-500" : "text-green-500"
                )}>{getStrengthLabel(strength)}</span>
              </div>
              <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full transition-colors duration-300", getStrengthColor(strength))}
                  initial={{ width: 0 }}
                  animate={{ width: `${((strength === 0 && password.length > 0 ? 1 : strength) / 4) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Length Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Password Length</Label>
                  <span className="text-sm font-bold bg-secondary px-2 py-1 rounded-md min-w-[2.5rem] text-center">{length}</span>
                </div>
                <Slider
                  value={[length]}
                  onValueChange={(vals) => setLength(vals[0])}
                  min={0}
                  max={64}
                  step={1}
                  disabled={true}
                  className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Character Options */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "includeUppercase", label: "Uppercase (A-Z)" },
                  { id: "includeLowercase", label: "Lowercase (a-z)" },
                  { id: "includeNumbers", label: "Numbers (0-9)" },
                  { id: "includeSymbols", label: "Symbols (!@#)" },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2 bg-secondary/30 p-3 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                    <Checkbox
                      id={opt.id}
                      checked={options[opt.id as keyof typeof options]}
                      onCheckedChange={(checked) => {
                        // Prevent unchecking the last option
                        const activeCount = Object.values(options).filter(Boolean).length;
                        if (!checked && activeCount <= 1) {
                          toast.warning("At least one option must be selected");
                          return;
                        }
                        setOptions(prev => ({ ...prev, [opt.id]: checked === true }))
                      }}
                    />
                    <Label htmlFor={opt.id} className="cursor-pointer flex-1 font-normal text-sm">{opt.label}</Label>
                  </div>
                ))}
              </div>



            </div>

            <Button size="lg" className="w-full font-bold text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" onClick={handleGenerate}>
              <Wand2 className="w-4 h-4 mr-2" /> Generate Password
            </Button>
          </CardContent>
        </Card>

        {/* Footer/Credit */}
        <p className="text-center text-xs text-muted-foreground mt-8 opacity-50">
          Securely generated in your browser. No data is sent to servers.
        </p>
      </motion.div>
    </div>
  );
}

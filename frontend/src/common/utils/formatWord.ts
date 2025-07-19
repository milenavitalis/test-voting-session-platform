export function cleanCpf(cpf: string): string {
  const cleanedCpf = cpf.replace(/\D/g, "");
  return cleanedCpf;
}

export function formatCpf(cpf: string): string {
  const cleaned = cleanCpf(cpf);
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function isValidCpf(cpf: string): boolean {
  const cleaned = cleanCpf(cpf);
  return cleaned.length === 11 && !/^(\d)\1{10}$/.test(cleaned);
}

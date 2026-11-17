// Utilidades de CPF (US03: o sistema recusa CPF já cadastrado; aqui só formato e dígitos).
export const apenasDigitos = (v = "") => v.replace(/\D/g, "").slice(0, 11);

export function mascaraCpf(v = "") {
  const d = apenasDigitos(v);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function cpfValido(v = "") {
  const d = apenasDigitos(v);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const dv = (n) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

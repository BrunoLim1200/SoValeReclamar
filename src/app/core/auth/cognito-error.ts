/** Translates a Cognito SDK error into a user-facing Portuguese message. */
export function mapCognitoError(err: unknown): string {
  const code = (err as { code?: string } | undefined)?.code;
  switch (code) {
    case 'NotConfigured':
      return 'Login ainda não está disponível nesta instância (Cognito não configurado).';
    case 'UserNotFoundException':
    case 'NotAuthorizedException':
      return 'Usuário ou senha incorretos.';
    case 'UsernameExistsException':
      return 'Esse nome de usuário já está em uso.';
    case 'InvalidPasswordException':
      return 'A senha não atende aos requisitos mínimos.';
    case 'InvalidParameterException':
      return 'Dados inválidos. Confira os campos e tente novamente.';
    case 'CodeMismatchException':
      return 'Código de verificação inválido.';
    case 'ExpiredCodeException':
      return 'Código de verificação expirado. Solicite um novo.';
    case 'UserNotConfirmedException':
      return 'Confirme seu cadastro antes de entrar.';
    case 'LimitExceededException':
    case 'TooManyRequestsException':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    default:
      return 'Algo deu errado. Tente novamente.';
  }
}

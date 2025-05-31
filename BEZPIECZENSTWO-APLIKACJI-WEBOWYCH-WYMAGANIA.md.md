# Aktualne 2025 Wymagania do projektu

-   Celem projektu jest zabezpieczenie FE oraz przynajmniej jednego API używając standardu OAuth 2.0. Mogą to być niezależne aplikacje..
-   **Termin oddania projektu to najpóźniej _20.06.2025_. Zachęcam do wcześniej oddawania**
-   Bliżej terminu podam godziny moich konsultacji (na wydziale i online), jeżeli ktoś będzie miał projekt gotowy wcześniej - możemy umówić się na prezentację we wcześniejszym terminie.
-   Projekt można połączyć z projektem z **Technologii chmurowych** (za dodatkowe punkty) lub jako oddzielny projekt. W przypadku tworzenia oddzielnego projektu proszę stworzyć go _tutaj_, proszę podpisać swoim imieniem i nazwiskiem w pliku README.md
-   Ocena projektu odbędzie się w trakcie prezentacji (max 10 min). Dla projektów łączonych (moje grupy 3 i 4) można zrobić jedną prezentację
-   **Proszę umieścić w projekcie krótkie README z instrukcją jak odpalić wszystkie komponenty**
-   Projekt będzie oceniany według następujących kryteriów (**kryteria mogą się jeszcze nieznacznie zmienić**):

| **Zagadnienie**                                                                                     | **Punktacja** |
| --------------------------------------------------------------------------------------------------- | ------------- |
| Projekt (FE, API, IdP) działa                                                                       | 5             |
| **Dokeryzacja:**                                                                                    |               |
| 1. projekt działa w kubernetes, lub                                                                 | 4             |
| 2. bez kubernetesa ale app i IdP jest w dockerze (z volumenem), lub                                 | 2             |
| 3. app odpalana lokalnie, keycloak na volumen z danymi                                              | 1             |
| Projekt jest dodany do projektu Technologii chmurowych                                              | 3             |
| FE jest zabezpieczony                                                                               | 4             |
| FE ma oddzielny panel admina niedostępny dla zwykłych użytkowników                                  | 2             |
| Przynajmniej jedno API jest zabezpieczone niezależnie od FE lub FE sam się autoryzuje do naszego BE | 4             |
| Więcej niż jedno API jest zabezpieczone                                                             | 1             |
| API zwraca różne wartości w zależności od roli użytkownika                                          | 2             |
| Zabezpieczenie zostało poprawnie zaprezentowane (mogę poprosić o wytłumaczenie flow)                | 2             |
| Czystość kodu i repozytorium                                                                        | 2             |
| PKCE                                                                                                | 1             |
| **Suma**                                                                                            | **30**        |

**Dodatkowe punkty:**

1. Aplikacje napisane w innym języku niż JS/TS (np. java, rust) — **4**
2. Dodanie zabezpieczenia do projektu z zeszłego semestru (lub innego swojego większego projektu) — **4**
3. FE korzysta ze stworzonego API — **4**

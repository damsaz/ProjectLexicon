using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLexicon.Services.Migrations
{
    public partial class mess3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConversationId",
                table: "Message",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 15, 16, 522, DateTimeKind.Local).AddTicks(8550));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 15, 16, 522, DateTimeKind.Local).AddTicks(8590));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Message");

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 10, 15, 186, DateTimeKind.Local).AddTicks(1820));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 10, 15, 186, DateTimeKind.Local).AddTicks(1860));
        }
    }
}
